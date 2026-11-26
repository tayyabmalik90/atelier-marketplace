import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { consumeToken } from "@/lib/auth";
import { appUrl } from "@/lib/mail";
export async function GET(req: Request) {
  const uid = await consumeToken(new URL(req.url).searchParams.get("token") || "", "verify");
  if (uid) await q("update users set email_verified=true where id=$1", [uid]);
  return NextResponse.redirect(`${appUrl()}/verify-email?status=${uid ? "success" : "invalid"}`);
}
