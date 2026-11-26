"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye } from "lucide-react";
import { motion } from "motion/react";
import { label, type Template } from "@/lib/template-types";
import { money } from "@/lib/utils";
import { Badge } from "./ui";
import { useApp } from "./Providers";
export function TemplateCard({ t, i = 0 }: { t: Template; i?: number }) {
  const { wishlist, toggleWish } = useApp(); const saved = wishlist.includes(t.id); const l = label(t);
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,20,40,.25)]">
      <div className="relative aspect-[8/5.2] overflow-hidden bg-black/5">
        <Link href={`/templates/${t.slug}`} aria-label={`View ${t.name}`}><Image src={t.preview_url} alt={`${t.name} template preview`} fill sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" unoptimized /></Link>
        {l && <div className="absolute left-3 top-3"><Badge tone={l === "Featured" ? "dark" : "brand"}>{l}</Badge></div>}
        <button onClick={() => toggleWish(t.id)} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110"><Heart size={16} className={saved ? "fill-brand text-brand" : ""} /></button>
        <a href={t.demo_url} target="_blank" rel="noreferrer" className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"><Eye size={14} />Live preview</a>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-muted">{t.category}</p><h3 className="mt-0.5 text-lg font-semibold tracking-tight">{t.name}</h3></div><div className="text-lg font-semibold tabular-nums">{money(t.price_cents)}</div></div>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{t.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{t.tech.map((x) => <Badge key={x}>{x}</Badge>)}{t.tags.slice(0, 2).map((x) => <Badge key={x} tone="brand">#{x}</Badge>)}</div>
        <div className="mt-5 flex gap-2 pt-1"><Link href={`/templates/${t.slug}`} className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-ink text-sm font-medium text-white transition hover:bg-black">View details</Link><Link href={`/preview/${t.slug}`} className="inline-flex h-10 items-center justify-center rounded-full border border-line px-4 text-sm transition hover:border-ink/30">Preview</Link></div>
      </div>
    </motion.article>
  );
}
export function CardSkeleton() { return <div className="overflow-hidden rounded-3xl border border-line bg-card"><div className="skeleton aspect-[8/5.2] rounded-none" /><div className="space-y-3 p-5"><div className="skeleton h-4 w-1/3" /><div className="skeleton h-6 w-2/3" /><div className="skeleton h-4 w-full" /><div className="skeleton h-10 w-full" /></div></div>; }
