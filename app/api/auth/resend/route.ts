import { createToken, getUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { sendMail, appUrl } from "@/lib/mail";
export async function POST() {
  const u = await getUser(); if (!u) return fail("Please sign in", 401);
  if (u.email_verified) return ok();
  const t = await createToken(u.id, "verify", 48);
  await sendMail(u.email, "Verify your Atelier email", `Confirm your email address:\n${appUrl()}/api/auth/verify?token=${t}\n`);
  return ok();
}
