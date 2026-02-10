# Phase 4: Contact & Conversion - Research

**Researched:** 2026-02-10
**Domain:** Astro server actions, Resend email API, form validation, FAQ pages
**Confidence:** HIGH

## Summary

This phase introduces the first server-side functionality to an otherwise fully static Astro site. The user decided on Resend for email delivery, which requires server-side code (Resend's API cannot be called from the browser due to CORS restrictions and API key exposure). The current project deploys to Apache shared hosting (InMotion) with no Node.js runtime, which is incompatible with server-side endpoints.

The recommended approach uses **Astro Actions** (stable since Astro 4.15, the modern replacement for raw API endpoints) with **Zod validation** and the **Resend Node.js SDK**. Astro Actions provide type-safe server functions with automatic input validation, reducing boilerplate compared to manual API endpoints. To make this work, the project needs to add the **Netlify adapter** (or equivalent) -- this keeps all existing pages static while enabling server-rendered endpoints for the contact form action only. The Netlify free tier is more than sufficient for a contact form (125K function invocations/month).

For the FAQ page, a simple static Astro page with structured data from a TypeScript data file (following the existing `src/data/services.ts` pattern) is the right approach. No server-side rendering needed for FAQ.

**Primary recommendation:** Add `@astrojs/netlify` adapter and use Astro Actions with `accept: 'form'` + Zod validation + Resend SDK for server-side email delivery. Deploy to Netlify instead of Apache for this phase forward. Keep `output: 'static'` (Astro 5 default) -- only the action endpoint runs server-side.

## Critical Architecture Decision: Hosting Change Required

The original architecture specified Apache shared hosting (InMotion) with no Node.js runtime. The user's decision to use Resend for email creates an incompatibility -- Resend requires server-side code to protect the API key and avoid CORS issues.

**Options evaluated:**

| Option | Approach | Tradeoff |
|--------|----------|----------|
| **Netlify deployment (RECOMMENDED)** | Add `@astrojs/netlify` adapter, deploy to Netlify, use Astro Actions | Requires hosting migration; simplest code, best DX, native Astro integration |
| Cloudflare Pages | Add `@astrojs/cloudflare` adapter, deploy to Cloudflare Pages | Similar to Netlify but less Astro ecosystem support |
| Separate Cloudflare Worker | Keep Apache hosting, create standalone Worker as email proxy | Complex architecture (two separate deployments), harder to maintain |
| Vercel deployment | Add `@astrojs/vercel` adapter, deploy to Vercel | Good option, but Netlify has better Astro-specific integration |

**Why Netlify is recommended:**
- Free tier: 125K serverless function invocations/month, 100GB bandwidth -- far exceeds a photography portfolio's needs
- The Netlify adapter is actively maintained by the Astro team
- Astro Actions + Netlify adapter confirmed working (Astro 5.15 added automatic skew protection for actions on Netlify)
- `astro add netlify` auto-configures everything
- Static pages remain static (pre-rendered at build time) -- only the action endpoint runs as a serverless function
- Environment variables managed through Netlify UI (no `.env` files in production)
- The existing GitHub Actions SFTP deployment pipeline would be replaced by Netlify's native Git integration (simpler)

**Impact on existing architecture:**
- Add `@astrojs/netlify` adapter to `astro.config.mjs`
- Add `env.schema` to `astro.config.mjs` for type-safe environment variables
- No changes to `output` setting (keep default `'static'`)
- All existing pages remain statically pre-rendered -- zero performance impact
- Only `src/actions/index.ts` runs server-side
- The `.htaccess` strategy from ARCHITECTURE.md is no longer needed (Netlify handles caching/headers natively)

**Confidence: HIGH** -- Verified via official Astro docs, Netlify docs, and the Astro Actions + Netlify adapter issue resolution (GitHub issue #274, confirmed fixed March 2025).

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro Actions | (built into astro 5.x) | Type-safe server functions | Official Astro feature since 4.15. Provides Zod validation, type-safe client calls, automatic form data parsing. The modern replacement for raw API endpoints. |
| Resend SDK | ^6.9.1 | Email delivery | The user's chosen email service. Simple API: `resend.emails.send()`. Supports HTML email, reply-to, batch sends. Free tier: 3,000 emails/month, 100/day. |
| @astrojs/netlify | latest | Server adapter | Official Astro adapter for Netlify. Converts server endpoints to Netlify Functions. Enables Astro Actions deployment. |
| astro/zod (z) | (built into astro 5.x) | Schema validation | Re-exported Zod from Astro. Used for action input validation. Import as `import { z } from 'astro/zod'`. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro:env | (built into astro 5.x) | Type-safe env variables | Defining RESEND_API_KEY and CONTACT_EMAIL as server secrets with `envField` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro Actions | Raw API endpoint (`src/pages/api/contact.ts`) | More boilerplate, no type-safe client calls, manual validation. Actions are the official recommended approach. |
| Resend SDK direct | Nodemailer + Resend SMTP | Unnecessary complexity. Resend SDK is simpler for Resend-specific use. |
| Netlify adapter | Cloudflare adapter | Cloudflare has Wrangler setup overhead. Netlify is more Astro-team maintained. |
| Zod validation | Manual validation | Zod is already included in Astro. Manual validation is error-prone and verbose. |

**Installation:**
```bash
npx astro add netlify
npm install resend
```

## Architecture Patterns

### Recommended Project Structure

```
src/
  actions/
    index.ts           # Astro Actions definition (contact form handler)
  components/
    contact/
      ContactForm.astro    # Form markup + client-side JS for submission
      FormField.astro      # Reusable form field with label + error slot
      SuccessMessage.astro # Inline success state (replaces form)
  data/
    services.ts        # Existing -- service categories for dropdown
    faq.ts             # FAQ questions and answers data
  pages/
    contact.astro      # Contact page with form + response time
    faq.astro          # Standalone FAQ page (or faq/index.astro)
```

### Pattern 1: Astro Action with Resend

**What:** Define a server action that validates form input with Zod and sends email via Resend.
**When to use:** For the contact form submission handler.

```typescript
// src/actions/index.ts
// Source: https://docs.astro.build/en/guides/actions/
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import { RESEND_API_KEY, CONTACT_EMAIL } from 'astro:env/server';

const resend = new Resend(RESEND_API_KEY);

export const server = {
  submitContact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Please enter a valid email address'),
      message: z.string().min(10, 'Please include a message (at least 10 characters)'),
      eventType: z.string().optional(),
      eventTypeOther: z.string().optional(),
      eventDate: z.string().optional(),
    }),
    handler: async (input) => {
      const { name, email, message, eventType, eventTypeOther, eventDate } = input;
      const actualEventType = eventType === 'other' ? eventTypeOther : eventType;

      try {
        // Send notification to Simon
        await resend.emails.send({
          from: 'Simon Wickes Photography <noreply@simonwickes.com>',
          to: [CONTACT_EMAIL],
          replyTo: email,
          subject: `New inquiry from ${name}`,
          html: `...notification email HTML...`,
        });

        // Send auto-confirmation to submitter
        await resend.emails.send({
          from: 'Simon Wickes Photography <noreply@simonwickes.com>',
          to: [email],
          subject: 'Thanks for your inquiry!',
          html: `...confirmation email HTML...`,
        });

        return { success: true };
      } catch (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send email. Please try again.',
        });
      }
    },
  }),
};
```

### Pattern 2: Client-Side Form Submission with Inline Feedback

**What:** Vanilla JavaScript form handler that calls the Astro Action and shows inline success/error states.
**When to use:** For the contact form component (no framework needed).

```astro
<!-- ContactForm.astro -->
<form id="contact-form" class="space-y-6">
  <!-- form fields -->
  <button type="submit" id="submit-btn">
    <span id="btn-text">Send Message</span>
    <span id="btn-spinner" class="hidden"><!-- spinner SVG --></span>
  </button>
</form>

<div id="success-message" class="hidden">
  <!-- Inline success state -->
</div>

<div id="error-message" class="hidden">
  <!-- Inline error state -->
</div>

<script>
  import { actions, isInputError } from 'astro:actions';

  const form = document.getElementById('contact-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const btnText = document.getElementById('btn-text')!;
  const btnSpinner = document.getElementById('btn-spinner')!;
  const successMsg = document.getElementById('success-message')!;
  const errorMsg = document.getElementById('error-message')!;

  function clearFieldErrors() {
    form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  }

  function showFieldError(fieldName: string, message: string) {
    const errorEl = form.querySelector(`[data-error="${fieldName}"]`);
    if (errorEl) errorEl.textContent = message;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors();

    // Disable button, show spinner
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');

    const formData = new FormData(form);
    const { data, error } = await actions.submitContact(formData);

    // Re-enable button
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnSpinner.classList.add('hidden');

    if (error) {
      if (isInputError(error)) {
        // Show inline validation errors per field
        for (const [field, messages] of Object.entries(error.fields)) {
          if (messages?.length) showFieldError(field, messages[0]);
        }
      } else {
        // Show general error
        errorMsg.classList.remove('hidden');
        errorMsg.textContent = error.message;
      }
      return;
    }

    // Success: hide form, show success message
    form.classList.add('hidden');
    successMsg.classList.remove('hidden');
  });
</script>
```

### Pattern 3: Type-Safe Environment Variables

**What:** Use Astro's `env.schema` to define server-only secret variables with type safety.
**When to use:** For Resend API key and contact email configuration.

```javascript
// astro.config.mjs
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://simonwickes.com",
  adapter: netlify(),
  build: {
    format: "directory",
  },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      CONTACT_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Pattern 4: FAQ Data Module

**What:** TypeScript data file for FAQ content, following the existing `services.ts` pattern.
**When to use:** For the FAQ page data.

```typescript
// src/data/faq.ts
export interface FAQItem {
  question: string;
  answer: string;
  category: 'booking' | 'process';
}

export const faqItems: FAQItem[] = [
  {
    question: "How far in advance should I book?",
    answer: "For weddings and events, I recommend booking 3-6 months...",
    category: 'booking',
  },
  // ... 10+ items
];

export function getFAQByCategory(category: FAQItem['category']): FAQItem[] {
  return faqItems.filter(item => item.category === category);
}
```

### Anti-Patterns to Avoid

- **Calling Resend from client-side JavaScript:** API key would be exposed. Resend blocks browser requests via CORS. Always use a server action.
- **Using raw API endpoints instead of Actions:** Actions provide type-safe clients, automatic Zod validation, and `isInputError()` for field-level errors. Raw endpoints require manual parsing.
- **Adding React/Vue just for form state:** Vanilla JavaScript with `FormData` + Astro Actions handles this cleanly. The form state is simple (submitting, success, error) and does not warrant a framework.
- **Accordion for FAQ:** The user explicitly decided all questions should be visible (not accordion). Use simple heading + paragraph pairs.
- **Redirecting after form submission:** The user decided on inline success message. Do not navigate away.
- **`import { z } from 'astro:schema'`:** This import path is deprecated in Astro 5 and removed in Astro 6. Use `import { z } from 'astro/zod'` instead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form input validation | Custom validation functions | Zod schemas via Astro Actions `input` | Zod handles string, email, min length, optional fields with clear error messages. Astro Actions auto-parses FormData to typed objects. |
| Email delivery | Raw `fetch()` to Resend API | Resend Node.js SDK (`resend.emails.send()`) | SDK handles auth headers, error handling, types. One function call vs manual request construction. |
| Server endpoint boilerplate | `export const POST: APIRoute` | `defineAction({ accept: 'form' })` | Actions auto-generate type-safe client functions, handle JSON/FormData parsing, provide `isInputError()` for field errors. |
| Environment variable access | `process.env.RESEND_API_KEY` | `astro:env/server` with `envField` schema | Type-safe, validated at build time, clearly separates client/server access. |
| Field-level error display | Manual error parsing from response | `isInputError(error)` + `error.fields` | Built into Astro Actions. Returns `{ fields: { name: ['error'], email: ['error'] } }` automatically. |
| Spinner/loading state | Custom state management | Simple class toggling (`hidden` class) | For a single form with binary state (idle/submitting), class toggling is sufficient. |

**Key insight:** Astro Actions + Zod validation eliminate most of the form handling boilerplate. The entire server-side logic is one function definition. The client-side is one event listener. No framework, no state management library, no custom validation code.

## Common Pitfalls

### Pitfall 1: Resend Domain Verification

**What goes wrong:** Emails fail to send or land in spam because the "from" domain is not verified in Resend.
**Why it happens:** Resend requires DNS verification (SPF + DKIM records) for custom domains. Without verification, you can only send from `onboarding@resend.dev`.
**How to avoid:** Before deploying, add `simonwickes.com` as a domain in the Resend dashboard and configure the SPF and DKIM DNS records. Use `onboarding@resend.dev` as the from address during development/testing.
**Warning signs:** Emails not arriving, Resend API returning 403 errors, emails landing in spam.

### Pitfall 2: Forgetting `accept: 'form'` on Action

**What goes wrong:** The action receives `[object FormData]` strings or fails to parse form data.
**Why it happens:** Without `accept: 'form'`, Astro Actions expect JSON input. FormData sent to a JSON action is not parsed correctly.
**How to avoid:** Always set `accept: 'form'` when the action receives data from an HTML form via `new FormData()`.
**Warning signs:** Action handler receives unexpected input types, Zod validation fails with cryptic errors.

### Pitfall 3: Missing Adapter for Actions

**What goes wrong:** Actions work in `astro dev` but fail with 404 in production.
**Why it happens:** Astro Actions require on-demand rendering. Without an adapter, the action endpoint is not deployed as a serverless function.
**How to avoid:** Install `@astrojs/netlify` (or equivalent adapter). Verify the `.netlify/functions-internal/` directory is created after build.
**Warning signs:** 404 responses to `/_actions/submitContact` in production, build warnings about missing adapter.

### Pitfall 4: Two Separate Email Sends Failing Independently

**What goes wrong:** The notification email to Simon succeeds but the confirmation email to the submitter fails (or vice versa), leaving an inconsistent state.
**Why it happens:** Two separate `resend.emails.send()` calls -- if the second fails, the first already sent.
**How to avoid:** Use Resend's batch API (`resend.batch.send()`) to send both emails atomically, OR wrap in try/catch and consider partial success acceptable (Simon gets the inquiry even if confirmation fails). Recommend: send notification first, confirmation second. If confirmation fails, still return success to user.
**Warning signs:** Intermittent "success" responses where the user never gets a confirmation email.

### Pitfall 5: Environment Variables Not Set in Netlify

**What goes wrong:** Action returns 500 error in production. Works locally with `.env` file.
**Why it happens:** Netlify environment variables must be set separately in the Netlify dashboard or CLI. The `.env` file is gitignored and not deployed.
**How to avoid:** After first deploy, set `RESEND_API_KEY` and `CONTACT_EMAIL` in Netlify Site Settings > Environment Variables. Use `astro:env` schema so missing vars are caught at build time.
**Warning signs:** Build succeeds but all form submissions fail with 500.

### Pitfall 6: Date Input Cross-Browser Inconsistency

**What goes wrong:** `<input type="date">` renders differently across browsers. Safari and Firefox have historically had poor date picker support.
**Why it happens:** Native date pickers are not fully standardized across browsers.
**How to avoid:** Use `<input type="date">` with a text fallback pattern, OR use a simple text input with placeholder "e.g., March 15, 2026" since the date field is optional and approximate dates are fine for photography inquiries. Recommend: use `<input type="text">` with a clear placeholder -- a photography inquiry does not need precise date validation.
**Warning signs:** Users on older browsers cannot select dates, date format varies by locale.

## Code Examples

### Complete Action Definition

```typescript
// src/actions/index.ts
// Source: https://docs.astro.build/en/guides/actions/
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import { RESEND_API_KEY, CONTACT_EMAIL } from 'astro:env/server';

const resend = new Resend(RESEND_API_KEY);

export const server = {
  submitContact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Please enter a valid email address'),
      message: z.string().min(10, 'Message must be at least 10 characters'),
      eventType: z.string().optional(),
      eventTypeOther: z.string().optional(),
      eventDate: z.string().optional(),
    }),
    handler: async (input) => {
      const { name, email, message, eventType, eventTypeOther, eventDate } = input;
      const displayEventType = eventType === 'other'
        ? (eventTypeOther || 'Other')
        : (eventType || 'Not specified');

      try {
        // Send notification email to Simon
        await resend.emails.send({
          from: 'Simon Wickes Photography <noreply@simonwickes.com>',
          to: [CONTACT_EMAIL],
          replyTo: email,
          subject: `New inquiry from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Event Type:</strong> ${displayEventType}</p>
            <p><strong>Event Date:</strong> ${eventDate || 'Not specified'}</p>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });

        // Send confirmation to submitter
        await resend.emails.send({
          from: 'Simon Wickes Photography <noreply@simonwickes.com>',
          to: [email],
          subject: "Thanks for reaching out!",
          html: `
            <h2>Thanks for your inquiry, ${name}!</h2>
            <p>I've received your message and will get back to you within 24-48 hours.</p>
            <p>In the meantime, feel free to check out my latest work on
              <a href="https://simonwickes.com">simonwickes.com</a>.</p>
            <p>Best regards,<br>Simon Wickes</p>
          `,
        });

        return { success: true };
      } catch (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong sending your message. Please try again or contact me directly.',
        });
      }
    },
  }),
};
```

### Client-Side Action Call with isInputError

```typescript
// Source: https://docs.astro.build/en/reference/modules/astro-actions/
import { actions, isInputError } from 'astro:actions';

const formData = new FormData(form);
const { data, error } = await actions.submitContact(formData);

if (error) {
  if (isInputError(error)) {
    // error.fields is { name?: string[], email?: string[], message?: string[], ... }
    for (const [field, messages] of Object.entries(error.fields)) {
      if (messages && messages.length > 0) {
        const errorEl = document.querySelector(`[data-error="${field}"]`);
        if (errorEl) errorEl.textContent = messages[0];
      }
    }
  } else {
    // ActionError -- show general error message
    showErrorBanner(error.message);
  }
  return;
}

// Success
form.classList.add('hidden');
successMessage.classList.remove('hidden');
```

### Astro Config with Netlify Adapter + Env Schema

```javascript
// astro.config.mjs
// Source: https://docs.astro.build/en/guides/environment-variables/
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://simonwickes.com",
  adapter: netlify(),
  build: {
    format: "directory",
  },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      CONTACT_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Event Type Dropdown with "Other" Free Text

```html
<label for="eventType">Event Type (optional)</label>
<select id="eventType" name="eventType">
  <option value="">Select an event type...</option>
  <option value="outdoor-portraits">Outdoor Portraits</option>
  <option value="weddings">Weddings</option>
  <option value="commercial">Commercial</option>
  <option value="landscape">Landscape</option>
  <option value="cars">Cars</option>
  <option value="assignments">Assignments</option>
  <option value="events">Events</option>
  <option value="live-performances">Live Performances</option>
  <option value="other">Other</option>
</select>

<!-- Shown conditionally when "Other" is selected -->
<div id="other-type-wrapper" class="hidden">
  <label for="eventTypeOther">Please describe</label>
  <input type="text" id="eventTypeOther" name="eventTypeOther"
         placeholder="What type of photography are you looking for?" />
</div>

<script>
  const select = document.getElementById('eventType') as HTMLSelectElement;
  const otherWrapper = document.getElementById('other-type-wrapper')!;
  select.addEventListener('change', () => {
    otherWrapper.classList.toggle('hidden', select.value !== 'other');
  });
</script>
```

### Resend Batch Send (Alternative for Atomic Delivery)

```typescript
// Source: https://resend.com/docs/api-reference/emails/send-batch-emails
// Note: batch API does not support attachments or scheduled_at
await resend.batch.send([
  {
    from: 'Simon Wickes Photography <noreply@simonwickes.com>',
    to: [CONTACT_EMAIL],
    replyTo: email,
    subject: `New inquiry from ${name}`,
    html: notificationHTML,
  },
  {
    from: 'Simon Wickes Photography <noreply@simonwickes.com>',
    to: [email],
    subject: "Thanks for reaching out!",
    html: confirmationHTML,
  },
]);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `export const POST: APIRoute` (raw endpoints) | `defineAction({ accept: 'form' })` (Astro Actions) | Astro 4.15 (stable) | Type-safe client calls, automatic validation, `isInputError()` for field errors. Significantly less boilerplate. |
| `output: 'hybrid'` config | `output: 'static'` (default) + adapter + per-route `prerender: false` | Astro 5.0 | Hybrid mode removed. Default static mode now supports per-route server rendering with just an adapter installed. No config change needed. |
| `import { z } from 'astro:schema'` | `import { z } from 'astro/zod'` | Astro 5.x (deprecated in 6.0) | `astro:schema` was an alias, now deprecated. Use `astro/zod` for forward compatibility. |
| `process.env.SECRET` | `import { SECRET } from 'astro:env/server'` | Astro 5.x | Type-safe, validated at build/start, clearly separates client/server access. |
| Web3Forms / Formspree (external form services) | Astro Actions + Resend (native server actions) | Astro 4.15+ | No external form service dependency. Full control over email content, validation, and delivery. Requires adapter/hosting that supports server functions. |

**Deprecated/outdated:**
- `astro:schema` import path -- deprecated, use `astro/zod`
- `output: 'hybrid'` config value -- removed in Astro 5, functionality merged into default `'static'`
- Raw API endpoint pattern for forms -- still works but Actions are the recommended approach

## Resend Configuration Notes

### Free Tier Limits (verified 2026)
- 3,000 emails per month
- 100 emails per day
- 1 custom domain per team
- No region selection (Pro plan feature)

### Domain Verification Requirements
- Must add domain in Resend dashboard
- Configure SPF record (DNS TXT)
- Configure DKIM record (DNS TXT)
- Optional: Add DMARC record for additional trust
- Until verified: can only send from `onboarding@resend.dev`

### Development Workflow
- Use `onboarding@resend.dev` as the "from" address during development
- Create a `.env` file locally with `RESEND_API_KEY` and `CONTACT_EMAIL`
- Set production env vars in Netlify dashboard after first deploy

## Open Questions

1. **Deployment migration timing**
   - What we know: The project currently targets Apache/InMotion hosting. Netlify is required for server-side actions.
   - What's unclear: Whether to migrate the entire site now or maintain parallel deployments temporarily.
   - Recommendation: Migrate fully to Netlify in this phase. Netlify can serve all existing static pages identically. The InMotion hosting can remain as a fallback but would not receive new deployments.

2. **Resend domain verification timeline**
   - What we know: DNS propagation can take 24-48 hours. Resend requires SPF + DKIM verification before sending from custom domains.
   - What's unclear: Whether Simon has access to DNS records for simonwickes.com.
   - Recommendation: Plan domain verification as a prerequisite task. Use `onboarding@resend.dev` as fallback during development. The from address can be updated after verification.

3. **Email formatting complexity**
   - What we know: User left email format to Claude's discretion. Options range from plain text to styled HTML.
   - What's unclear: How much branding Simon wants in notification/confirmation emails.
   - Recommendation: Use clean, simple HTML with inline styles (for email client compatibility). No complex templates needed for v1. A formatted list of form fields for notification, a friendly paragraph for confirmation.

## Sources

### Primary (HIGH confidence)
- [Astro Actions Guide](https://docs.astro.build/en/guides/actions/) -- Complete Actions documentation including defineAction, accept: 'form', isInputError
- [Astro Actions API Reference](https://docs.astro.build/en/reference/modules/astro-actions/) -- ActionError codes, isInputError type, SafeResult type
- [Astro On-Demand Rendering](https://docs.astro.build/en/guides/on-demand-rendering/) -- Per-route prerender: false, adapter requirements
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/) -- envField schema, astro:env/server imports
- [Astro Netlify Adapter](https://docs.astro.build/en/guides/integrations-guide/netlify/) -- Installation, configuration, functions deployment
- [Astro Endpoints](https://docs.astro.build/en/guides/endpoints/) -- Server endpoint patterns (for reference, Actions preferred)
- [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/) -- output: 'hybrid' removal, static mode changes
- [Resend Node.js SDK](https://resend.com/docs/send-with-nodejs) -- Installation, send email API
- [Resend Send Email API](https://resend.com/docs/api-reference/emails/send-email) -- All parameters: from, to, reply_to, subject, html, text, tags
- [Resend Batch API](https://resend.com/docs/api-reference/emails/send-batch-emails) -- Batch send up to 100 emails
- [Resend Domain Management](https://resend.com/docs/dashboard/domains/introduction) -- Domain verification, SPF, DKIM requirements

### Secondary (MEDIUM confidence)
- [Astro + Resend on Netlify Guide](https://developers.netlify.com/guides/send-emails-with-astro-and-resend/) -- Complete integration tutorial using Netlify adapter
- [Astro Contact Form with Server Actions + Resend](https://contentisland.net/en/blog/astro-contact-form-server-actions-resend/) -- End-to-end tutorial with Actions pattern
- [Resend CORS FAQ](https://resend.com/docs/knowledge-base/how-do-i-fix-cors-issues) -- Confirmed: cannot call Resend API from browser
- [GitHub Issue #274](https://github.com/withastro/adapters/issues/274) -- Actions 404 on Netlify with prerendered pages -- confirmed fixed
- [Resend npm package](https://www.npmjs.com/package/resend) -- v6.9.1, published January 2026

### Tertiary (LOW confidence)
- [Netlify free tier limits](https://www.netlify.com/pricing/) -- Function invocation limits may change; verify current pricing

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Astro Actions, Resend SDK, and Netlify adapter all verified via official docs
- Architecture: HIGH -- Pattern verified via official Astro Actions guide + multiple community tutorials using identical approach
- Pitfalls: HIGH -- Domain verification, CORS limitations, and env var requirements all documented in official sources
- Hosting migration: MEDIUM -- Netlify is well-documented for Astro but represents a change from the original Apache plan

**Research date:** 2026-02-10
**Valid until:** 2026-03-10 (stable technologies, 30-day validity)
