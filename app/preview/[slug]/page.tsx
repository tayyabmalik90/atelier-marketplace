import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates";
import { DevicePreview } from "@/components/DevicePreview";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const t = await getTemplate((await params).slug); return { title: t ? `${t.name} live preview` : "Preview" }; }
export default async function Preview({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTemplate((await params).slug); if (!t) notFound();
  return <DevicePreview id={t.id} slug={t.slug} name={t.name} price={t.price_cents} demo={t.demo_url} />;
}
