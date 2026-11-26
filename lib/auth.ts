import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { one, q } from "./db";

const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "dev-only-secret-change-me-please-32chars");
const COOKIE = "atelier_session";
export type User = { id: string; email: string; name: string; role: string; email_verified: boolean; created_at: string };

export const hashPassword = (p: string) => bcrypt.hash(p, 10);
export const checkPassword = (p: string, h: string) => bcrypt.compare(p, h);

export async function startSession(userId: string) {
  const jwt = await new SignJWT({ uid: userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("14d").sign(secret());
  (await cookies()).set(COOKIE, jwt, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 14 * 86400 });
}
export async function endSession() { (await cookies()).delete(COOKIE); }

export async function getUser(): Promise<User | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  try {
    const { payload } = await jwtVerify(c, secret());
    return (await one<User>("select id,email,name,role,email_verified,created_at from users where id=$1", [payload.uid])) ?? null;
  } catch { return null; }
}
export async function requireAdmin() { const u = await getUser(); return u?.role === "admin" ? u : null; }

export async function createToken(userId: string, kind: "verify" | "reset", hours: number) {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  await q("delete from auth_tokens where user_id=$1 and kind=$2", [userId, kind]);
  await q("insert into auth_tokens(user_id,kind,token_hash,expires_at) values($1,$2,$3, now() + ($4 || ' hours')::interval)", [userId, kind, hash, String(hours)]);
  return raw;
}
export async function consumeToken(raw: string, kind: "verify" | "reset") {
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const t = await one<{ id: string; user_id: string }>("select id,user_id from auth_tokens where token_hash=$1 and kind=$2 and used=false and expires_at>now()", [hash, kind]);
  if (!t) return null;
  await q("update auth_tokens set used=true where id=$1", [t.id]);
  return t.user_id;
}
// short-lived signed download tokens (only issued after a paid order is verified)
export async function signDownload(orderId: string, templateId: number) {
  return new SignJWT({ o: orderId, t: templateId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("10m").sign(secret());
}
export async function verifyDownload(tok: string) {
  try { const { payload } = await jwtVerify(tok, secret()); return { orderId: String(payload.o), templateId: Number(payload.t) }; } catch { return null; }
}
