import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { storageDir } from "@/lib/bundle";
const TYPES: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };
export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const name = path.basename((await params).path.join("/"));
  const f = path.join(storageDir("media"), name);
  if (!TYPES[path.extname(name).toLowerCase()] || !fs.existsSync(f)) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(fs.readFileSync(f)), { headers: { "Content-Type": TYPES[path.extname(name).toLowerCase()], "Cache-Control": "public, max-age=31536000, immutable" } });
}
