import { q } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function sitemap() {
  const u = process.env.APP_URL || "http://localhost:3000";
  const t = await q<{ slug: string }>("select slug from templates where status='published'");
  return [...["", "/templates", "/about", "/faqs", "/help", "/contact", "/terms", "/privacy", "/refund-policy", "/license"].map((p) => ({ url: u + p })), ...t.map((x) => ({ url: `${u}/templates/${x.slug}` }))];
}
