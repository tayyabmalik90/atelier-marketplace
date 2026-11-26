import fs from "node:fs";
import path from "node:path";
import JSZip from "jszip";
import type { Template } from "./templates";

export function storageDir(sub: string) { const d = path.join(process.cwd(), "storage", sub); fs.mkdirSync(d, { recursive: true }); return d; }

export async function buildBundle(t: Template): Promise<{ data: Buffer; name: string }> {
  if (t.file_path) {
    const f = path.join(storageDir("files"), path.basename(t.file_path));
    if (fs.existsSync(f)) return { data: fs.readFileSync(f), name: `${t.slug}${path.extname(f) || ".zip"}` };
  }
  const zip = new JSZip(); const root = zip.folder(t.slug)!;
  const demoDir = path.join(process.cwd(), "public", "demos", t.slug);
  if (fs.existsSync(demoDir)) for (const f of fs.readdirSync(demoDir)) root.file(f, fs.readFileSync(path.join(demoDir, f)));
  root.file("README.md", `# ${t.name}\n\n${t.description}\n\n- Category: ${t.category}\n- Style: ${t.style}\n- Stack: ${t.tech.join(", ")}\n- Features: ${t.features.join(", ")}\n\n## Getting started\n1. Unzip this folder.\n2. Open \`index.html\` in your browser to preview.\n3. Edit the text, colours (CSS variables at the top of the stylesheet) and images.\n4. Upload the folder to any static host (Vercel, Netlify, Cloudflare Pages) to go live.\n\n## Customisation\nAll colours, fonts and spacing live in a single <style> block. Replace placeholder copy directly in the HTML.\n\n## Support\nEmail support@atelier.test with your order ID. We reply within one business day.\n`);
  root.file("LICENSE.txt", `Atelier Standard License\n\nYou may use ${t.name} for one end project (personal or client). You may modify it freely.\nYou may not resell, redistribute or sublicense the template files themselves.\n`);
  return { data: await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }), name: `${t.slug}.zip` };
}
