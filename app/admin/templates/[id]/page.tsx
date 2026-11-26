import { notFound } from "next/navigation";
import { one } from "@/lib/db";
import type { Template } from "@/lib/templates";
import { TemplateForm } from "@/components/TemplateForm";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const t = await one<Template>("select * from templates where id=$1", [Number((await params).id)]); if (!t) notFound();
  return <div><h1 className="mb-8 font-display text-5xl font-semibold">Edit {t.name}</h1><TemplateForm initial={{ id: t.id, name: t.name, slug: t.slug, description: t.description, category: t.category, type: t.type, style: t.style, tech: t.tech, features: t.features, tags: t.tags, price: t.price_cents / 100, previewUrl: t.preview_url, screenshots: t.screenshots, demoUrl: t.demo_url, filePath: t.file_path, badge: t.badge, status: t.status }} /></div>;
}
