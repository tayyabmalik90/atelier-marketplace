import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";
import { Container } from "./ui";
const col = (t: string, items: [string, string][]) => <div><h4 className="mb-4 text-sm font-semibold">{t}</h4><ul className="space-y-2.5 text-sm text-muted">{items.map(([l, h]) => <li key={h + l}><Link href={h} className="transition hover:text-ink">{l}</Link></li>)}</ul></div>;
export function Footer() {
  return <footer className="mt-24 border-t border-line bg-white"><Container className="py-14">
    <div className="grid gap-10 md:grid-cols-5">
      <div className="md:col-span-2"><div className="font-display text-3xl font-semibold">Atelier<span className="text-brand">.</span></div><p className="mt-3 max-w-xs text-sm text-muted">Premium, ready-made websites at one fixed price. Preview live, buy once, launch today.</p>
        <div className="mt-5 flex gap-3 text-sm text-muted">{["Twitter", "Instagram", "LinkedIn", "Dribbble"].map((s) => <a key={s} href={`https://${s.toLowerCase()}.com`} target="_blank" rel="noreferrer" className="hover:text-ink">{s}</a>)}</div></div>
      {col("Explore", [["All templates", "/templates"], ["Featured", "/templates?badge=featured"], ["New arrivals", "/templates?sort=newest"], ["Pricing, simply", "/faqs"]])}
      {col("Categories", CATEGORIES.slice(0, 5).map((c) => [c.name, "/templates?category=" + encodeURIComponent(c.name)] as [string, string]))}
      {col("Support", [["Help & Support", "/help"], ["FAQs", "/faqs"], ["Contact", "/contact"], ["About", "/about"], ["Terms", "/terms"], ["Privacy", "/privacy"], ["Refunds", "/refund-policy"], ["License", "/license"]])}
    </div>
    <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-xs text-muted"><span>© 2026 Atelier. All rights reserved.</span><span>Secure checkout · Instant delivery · 14-day refund window</span></div>
  </Container></footer>;
}
