interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using the configured provider.
 *
 * Supports three modes (set EMAIL_PROVIDER env var):
 *   - "resend"  — uses Resend API (default if RESEND_API_KEY is set)
 *   - "log"     — logs to console (development fallback)
 *
 * Required env vars for Resend:
 *   RESEND_API_KEY
 *   EMAIL_FROM (e.g. "Resum <noreply@yourdomain.com>")
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER || (process.env.RESEND_API_KEY ? "resend" : "log");

  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || "Resum <noreply@resum-mu.vercel.app>";

    if (!apiKey) {
      console.error("[email] RESEND_API_KEY is not set");
      return;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [options.to],
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Failed to send:", res.status, body);
    }
  } else {
    // Development fallback — log to console
    console.log("──────────────────────────────────────");
    console.log(`📧 Email to: ${options.to}`);
    console.log(`   Subject:  ${options.subject}`);
    console.log(`   Body:     ${options.html.replace(/<[^>]*>/g, "")}`);
    console.log("──────────────────────────────────────");
  }
}
