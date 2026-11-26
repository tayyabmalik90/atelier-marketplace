import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { storageDir } from "@/lib/bundle";
export async function POST(req: Request) {
  if (!(await requireAdmin())) return fail("Forbidden", 403);
  const form = await req.formData(); const file = form.get("file"); const kind = form.get("kind");
  if (!(file instanceof File)) return fail("No file");
  const ext = path.extname(file.name).toLowerCase(); const id = crypto.randomUUID();
  if (kind === "file") {
    if (ext !== ".zip") return fail("Template files must be .zip archives");
    if (file.size > 100 * 1024 * 1024) return fail("File too large (max 100 MB)");
    fs.writeFileSync(path.join(storageDir("files"), id + ext), Buffer.from(await file.arrayBuffer()));
    return ok({ path: id + ext });
  }
  if (![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) return fail("Images must be PNG, JPG, WEBP or GIF");
  if (file.size > 8 * 1024 * 1024) return fail("Image too large (max 8 MB)");
  fs.writeFileSync(path.join(storageDir("media"), id + ext), Buffer.from(await file.arrayBuffer()));
  return ok({ url: `/api/media/${id}${ext}` });
}
