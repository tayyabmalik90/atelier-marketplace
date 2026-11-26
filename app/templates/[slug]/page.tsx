import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { getTemplate, related, label } from "@/lib/templates";
import { getUser } from "@/lib/auth";
import { one } from "@/lib/db";
import { Gallery } from "@/components/Gallery";
import { BuyBox } from "@/components/BuyBox";
import { TemplateCard } from "@/components/TemplateCard";
import { Badge, Container } from "@/components/ui";
import { money } from "@/lib/utils";
export const dynamic = "force-dynamic";
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const t = await getTemplate((await params).slug); if (!t) return {};
  return { title: `${t.name} — ${t.type} template`, description: t.description, openGraph: { title: `${t.name} — ${t.category} template`, description: t.description, images: [t.preview_url] } };
}
const H = ({ children }: { children: React.ReactNode }) => <h2 className="mb-4 font-display text-4xl font-semibold tracking-tight">{children}</h2>;
export default async function Detail({ params }: P) {
  const t = await getTemplate((await params).slug); if (!t) notFound();
  const u = await getUser();
  const owned = u ? await one<{ id: string }>("select o.id from orders o join order_items oi on oi.order_id=o.id where o.user_id=$1 and o.status='paid' and oi.template_id=$2 limit 1", [u.id, t.id]) : undefined;
  const rel = await related(t); const l = label(t);
  const ld = { "@context": "https://schema.org", "@type": "Product", name: t.name, description: t.description, image: t.preview_url, category: t.category, offers: { "@type": "Offer", price: (t.price_cents / 100).toFixed(2), priceCurrency: "USD", availability: "https://schema.org/InStock" } };
  return <Container className="py-8 sm:py-12">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted"><Link href="/templates" className="hover:text-ink">Templates</Link> / <Link href={"/templates?category=" + encodeURIComponent(t.category)} className="hover:text-ink">{t.category}</Link> / <span className="text-ink">{t.name}</span></nav>
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div><Gallery shots={[t.preview_url, ...t.screenshots.filter((s) => s !== t.preview_url)]} name={t.name} />
        <div className="mt-10"><div className="flex flex-wrap gap-2">{l && <Badge tone="brand">{l}</Badge>}<Badge>{t.category}</Badge><Badge>{t.style}</Badge></div>
          <h1 className="mt-4 font-display text-6xl font-semibold tracking-tight">{t.name}</h1><p className="mt-4 max-w-2xl text-lg text-muted">{t.description}</p></div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <section><H>Included features</H><ul className="space-y-2.5 text-sm">{[...t.features, "Clean, commented code", "Cross-browser tested", "Accessible markup", "SEO-ready structure"].map((f) => <li key={f} className="flex gap-2.5"><Check size={16} className="mt-0.5 text-brand" />{f}</li>)}</ul></section>
          <section><H>Technology</H><div className="flex flex-wrap gap-2">{t.tech.map((x) => <Badge key={x} tone="dark">{x}</Badge>)}</div><p className="mt-4 text-sm text-muted">Industry: {t.category}<br />Website type: {t.type}</p>
            <h3 className="mb-2 mt-6 text-sm font-semibold">Responsive compatibility</h3><p className="text-sm text-muted">Tested on desktop (1440px+), laptop, tablet (768px) and mobile (375px). Works in current Chrome, Safari, Firefox and Edge.</p></section>
          <section><H>What's included</H><ul className="space-y-2.5 text-sm">{["Complete template source files", "Documentation (README + setup guide)", "Licence for one end project", "Free updates for this version", "Email support"].map((f) => <li key={f} className="flex gap-2.5"><Check size={16} className="mt-0.5 text-brand" />{f}</li>)}</ul></section>
          <section><H>Customisation &amp; support</H><p className="text-sm text-muted">Colours, fonts and spacing are defined in one place so rebranding takes minutes. Replace the placeholder copy and images and publish to any host.</p><p className="mt-3 text-sm text-muted">Questions? Visit <Link href="/help" className="text-brand underline">Help &amp; Support</Link> or email support@atelier.test. Replies within one business day.</p></section>
        </div></div>
      <div><div className="lg:sticky lg:top-24"><BuyBox id={t.id} slug={t.slug} price={t.price_cents} demo={t.demo_url} owned={owned?.id} />
        <div className="mt-4 flex flex-wrap gap-1.5">{t.tags.map((x) => <Link key={x} href={"/templates?q=" + x} className="rounded-full bg-black/5 px-3 py-1 text-xs hover:bg-black/10">#{x}</Link>)}</div></div></div>
    </div>
    <section className="mt-24"><h2 className="mb-8 font-display text-5xl font-semibold tracking-tight">Related templates</h2><div className="grid gap-6 md:grid-cols-3">{rel.map((r, i) => <TemplateCard key={r.id} t={r} i={i} />)}</div></section>
  </Container>;
}
