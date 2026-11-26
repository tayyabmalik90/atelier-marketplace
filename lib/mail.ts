import { q } from "./db";
export const appUrl = () => process.env.APP_URL || "http://localhost:3000";
export async function sendMail(to: string, subject: string, body: string) {
  await q("insert into emails(to_email,subject,body) values($1,$2,$3)", [to, subject, body]);
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.EMAIL_FROM || "Atelier <onboarding@resend.dev>", to, subject, text: body }),
      });
    } catch (e) { console.error("email send failed", e); }
  } else console.log(`\n[email → ${to}] ${subject}\n${body}\n`);
}
