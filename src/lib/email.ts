import "server-only";

/**
 * Email delivery for the contact form (Resend REST API).
 *
 * Environment:
 *   RESEND_API_KEY      Resend API key. Required in production unless CONTACT_DELIVERY=log.
 *   CONTACT_TO_EMAIL    Inbox that receives messages (defaults to the profile email).
 *   CONTACT_FROM_EMAIL  Verified sender, e.g. "Shanib Burney <hello@your-domain>". Until a domain
 *                       is verified, Resend's shared sender is used.
 *   CONTACT_DELIVERY    "log" prints messages to the server log instead of sending them.
 */
export type EmailMessage = { to: string; subject: string; text: string; replyTo?: string };

const SHARED_SENDER = "Portfolio <onboarding@resend.dev>";

export type DeliveryMode = "resend" | "log" | "unconfigured";

export function deliveryMode(): DeliveryMode {
  if (process.env.CONTACT_DELIVERY === "log") return "log";
  if (process.env.RESEND_API_KEY) return "resend";
  return process.env.NODE_ENV === "production" ? "unconfigured" : "log";
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  const mode = deliveryMode();
  if (mode === "log") {
    console.info(`[contact] email (not sent, log mode)\n  to: ${message.to}\n  subject: ${message.subject}\n${message.text}`);
    return;
  }
  if (mode === "unconfigured") throw new Error("Email delivery is not configured: set RESEND_API_KEY.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? SHARED_SENDER,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
  }
}
