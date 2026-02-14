import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { Resend } from "resend";
import { RESEND_API_KEY, CONTACT_EMAIL } from "astro:env/server";

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight
export const OPTIONS: APIRoute = () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Please include a message (at least 10 characters)"),
  eventType: z.string().optional(),
  eventTypeOther: z.string().optional(),
  eventDate: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: { message: parsed.error.issues[0].message } }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const { name, email, message, eventType, eventTypeOther, eventDate } = parsed.data;

  let resolvedEventType = "Not specified";
  if (eventType === "other" && eventTypeOther) {
    resolvedEventType = eventTypeOther;
  } else if (eventType) {
    resolvedEventType = eventType;
  }

  const formattedMessage = message.replace(/\n/g, "<br>");

  try {
    await resend.emails.send({
      from: "Simon Wickes Photography <onboarding@resend.dev>",
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0 0 10px 0;"><strong>Event Type:</strong> ${resolvedEventType}</p>
            <p style="margin: 0 0 10px 0;"><strong>Event Date:</strong> ${eventDate || "Not specified"}</p>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="color: #333; margin: 0 0 10px 0;">Message:</h3>
            <p style="margin: 0; line-height: 1.6; color: #555;">${formattedMessage}</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send notification email:", error);
    return new Response(
      JSON.stringify({ error: { message: "Sorry, there was a problem sending your message. Please try again later." } }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Confirmation email - don't fail if this errors
  try {
    await resend.emails.send({
      from: "Simon Wickes Photography <onboarding@resend.dev>",
      to: [email],
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Thanks for getting in touch!</h2>
          <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">Hi ${name},</p>
          <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
            Thank you for reaching out. I've received your message and will get back to you within 24-48 hours.
          </p>
          <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
            In the meantime, feel free to browse more of my work at
            <a href="https://simonwickes.com" style="color: #007bff;">simonwickes.com</a>.
          </p>
          <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">Best regards,<br>Simon Wickes</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
};
