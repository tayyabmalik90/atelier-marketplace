"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, AnimatePresence, motion, useInView } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { CATEGORIES } from "@/lib/utils";
import { STEPS, TESTIMONIALS, WHY } from "@/lib/data";
import { Container } from "./ui";
import { Reveal } from "./Reveal";

export function Marquee({ items }: { items: string[] }) {
  const all = [...items, ...items];
  return <div aria-hidden className="overflow-hidden border-y border-line bg-white py-5"><div className="marquee-track">{all.map((x, i) => <span key={i} className="font-display text-2xl text-ink/60">{x} <span className="mx-6 text-brand">✦</span></span>)}</div></div>;
}
export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return <Reveal className="mx-auto mb-12 max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">{eyebrow}</p><h2 className="mt-3 font-display text-5xl font-semibold tracking-tight">{title}</h2>{sub && <p className="mt-3 text-muted">{sub}</p>}</Reveal>;
}
export function Categories({ counts }: { counts: Record<string, number> }) {
  return <section id="categories" className="scroll-mt-20 py-24"><Container><SectionHead eyebrow="Categories" title="Find a site for any business" sub="Ten industries, each with templates built around how that business actually works." />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">{CATEGORIES.map((c, i) => (
      <Reveal key={c.slug} delay={(i % 5) * 0.05}><Link href={"/templates?category=" + encodeURIComponent(c.name)} className="group relative flex h-44 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-xl">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-soft transition-transform duration-500 group-hover:scale-[2.2]" />
        <ArrowUpRight className="relative ml-auto text-muted transition group-hover:rotate-12 group-hover:text-brand" size={18} />
        <div className="relative"><h3 className="text-[15px] font-semibold leading-snug">{c.name}</h3><p className="mt-1 text-xs text-muted">{counts[c.name] ?? 0} templates</p></div></Link></Reveal>))}</div></Container></section>;
}
export function Why() {
  return <section className="bg-ink py-24 text-white"><Container><Reveal className="mx-auto mb-14 max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[.18em] text-indigo-300">Why Atelier</p><h2 className="mt-3 font-display text-5xl font-semibold">Everything you need. Nothing you don't.</h2></Reveal>
    <div className="grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">{WHY.map(([t, d], i) => <motion.div key={t} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="bg-ink p-8 transition hover:bg-white/[.04]"><Check className="mb-5 rounded-full bg-indigo-500/20 p-1.5 text-indigo-300" size={30} /><h3 className="text-lg font-semibold">{t}</h3><p className="mt-2 text-sm text-white/60">{d}</p></motion.div>)}</div></Container></section>;
}
export function How() {
  return <section id="how" className="scroll-mt-20 py-24"><Container><SectionHead eyebrow="How it works" title="From idea to live in three steps" />
    <div className="grid gap-6 md:grid-cols-3">{STEPS.map(([t, d], i) => <Reveal key={t} delay={i * 0.1}><div className="h-full rounded-3xl border border-line bg-white p-8"><div className="font-display text-7xl text-brand/30">0{i + 1}</div><h3 className="mt-4 text-xl font-semibold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></div></Reveal>)}</div></Container></section>;
}
function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref, { once: true });
  useEffect(() => { if (!inView) return; const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix; } }); return () => c.stop(); }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}
export function Stats({ templates, sales }: { templates: number; sales: number }) {
  const s: [number, string, string][] = [[templates, "", "Premium templates"], [sales, "+", "Happy customers"], [10, "", "Industries covered"], [14, "", "Day refund window"]];
  return <section className="py-4"><Container><div className="grid grid-cols-2 gap-6 rounded-3xl border border-line bg-white p-8 lg:grid-cols-4">{s.map(([n, suf, l]) => <div key={l} className="text-center"><div className="font-display text-5xl font-semibold"><Count to={n} suffix={suf} /></div><div className="mt-1 text-sm text-muted">{l}</div></div>)}</div></Container></section>;
}
export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 5500); return () => clearInterval(t); }, []);
  const [q, n, r] = TESTIMONIALS[i];
  return <section className="py-24"><Container><SectionHead eyebrow="Testimonials" title="Loved by builders and founders" />
    <div className="mx-auto max-w-3xl text-center"><div className="relative min-h-52"><AnimatePresence mode="wait"><motion.figure key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}><blockquote className="font-display text-4xl leading-tight sm:text-[2.75rem]">“{q}”</blockquote><figcaption className="mt-6 text-sm"><b>{n}</b> <span className="text-muted">· {r}</span></figcaption></motion.figure></AnimatePresence></div>
      <div className="mt-6 flex justify-center gap-2">{TESTIMONIALS.map((_, k) => <button key={k} aria-label={`Show testimonial ${k + 1}`} onClick={() => setI(k)} className={"h-2 rounded-full transition-all " + (k === i ? "w-8 bg-ink" : "w-2 bg-ink/20")} />)}</div></div></Container></section>;
}
export function FinalCTA() {
  return <section className="py-12"><Container><Reveal><div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-20 text-center text-white"><div aria-hidden className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl" /><div aria-hidden className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
    <h2 className="relative mx-auto max-w-2xl font-display text-5xl font-semibold sm:text-6xl">Your next website is already built.</h2><p className="relative mx-auto mt-4 max-w-md text-white/60">Preview any template live, then own it for one fixed price.</p>
    <Link href="/templates" className="relative mt-9 inline-flex h-13 items-center rounded-full bg-white px-8 text-base font-medium text-ink transition hover:-translate-y-0.5 hover:shadow-xl">Explore Templates</Link></div></Reveal></Container></section>;
}
