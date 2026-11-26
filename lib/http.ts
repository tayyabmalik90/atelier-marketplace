import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
export const ok = (d: any = {}) => NextResponse.json({ ok: true, ...d });
export const fail = (error: string, status = 400, extra: any = {}) => NextResponse.json({ ok: false, error, ...extra }, { status });
export async function parse<T>(req: Request, schema: ZodSchema<T>): Promise<{ data?: T; err?: NextResponse }> {
  try { return { data: schema.parse(await req.json()) }; }
  catch (e) { return { err: fail(e instanceof ZodError ? e.errors[0].message : "Invalid request", 422) }; }
}
