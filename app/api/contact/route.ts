import { z } from "zod";
import { fail, ok, parse } from "@/lib/http";
import { sendMail } from "@/lib/mail";
export async function POST(req: Request) {
  const { data, err } = await parse(req, z.object({ name: z.string().trim().min(2, "Enter your name"), email: z.string().trim().email("Enter a valid email"), message: z.string().trim().min(10, "Message is too short").max(4000) })); if (err) return err;
  await sendMail("support@atelier.test", `Contact form: ${data!.name}`, `From: ${data!.name} <${data!.email}>\n\n${data!.message}`);
  return ok();
}
