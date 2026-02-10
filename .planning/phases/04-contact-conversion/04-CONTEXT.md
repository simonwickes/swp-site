# Phase 4: Contact & Conversion - Context

**Gathered:** 2026-02-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can inquire about photography services through a contact form with name, email, message, event type, and date fields. Simon receives email notifications for submissions, and submitters get an auto-confirmation. A separate FAQ page answers common questions. Success/error feedback is clear and includes expected response time.

</domain>

<decisions>
## Implementation Decisions

### Form fields & layout
- Standard fields: name, email, message, event type, event date
- Event type: Dropdown with service categories PLUS "Other" option with free text
- Two-column layout on desktop (name/email side by side, message full width)
- Date field: Claude's discretion (date picker vs free text)

### Submission feedback
- Inline success message (form replaced with thank you on same page, no redirect)
- Include specific response time: "I'll get back to you within 24-48 hours"
- Inline validation errors under each invalid field
- Button spinner + disabled state while submitting

### Email delivery
- Use Resend as email service
- Recipient email configured via CONTACT_EMAIL environment variable
- Auto-confirmation email sent to submitter acknowledging receipt
- Email format: Claude's discretion (simple list vs styled HTML)

### FAQ content & structure
- Separate /faq/ page (not on contact page)
- All questions visible (not accordion)
- 10+ comprehensive questions
- Cover both booking/pricing AND process/deliverables topics

### Claude's Discretion
- Date field input type (picker vs free text)
- Email notification formatting style
- Exact FAQ questions content (within topic guidelines)
- Form field order and spacing details

</decisions>

<specifics>
## Specific Ideas

- Response time commitment: 24-48 hours
- Event type should offer dropdown categories matching the 8 service types, plus free text option
- FAQ page is standalone, linked from contact page and possibly navigation

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-contact-conversion*
*Context gathered: 2026-02-10*
