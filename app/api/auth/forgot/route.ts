import { z } from "zod";
import { one } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { ok, parse } from "@/lib/http";
import { sendMail, appUrl } from "@/lib/mail";
export async function POST(req: Request) {
  const { data, err } = await parse(req, z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email") })); if (err) return err;
  const u = await one<any>("select id from users where email=$1", [data!.email]);
  if (u) { const t = await createToken(u.id, "reset", 1); await sendMail(data!.email, "Reset your Atelier password", `Use this link within one hour:\n${appUrl()}/reset-password?token=${t}\n\nIf you didn't ask for this, ignore this email.`); }
  return ok(); // same response whether or not the account exists
}
