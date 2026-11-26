"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, FEATURES, STYLES, TECHS } from "@/lib/utils";
import { Button } from "./ui";

const SORTS = [["featured", "Featured"], ["popular", "Most popular"], ["newest", "Newest"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"]];
export function useParams() {
  const sp = useSearchParams(); const router = useRouter(); const path = usePathname(); const [pending, start] = useTransition();
  const push = (fn: (p: URLSearchParams) => void) => { const p = new URLSearchParams(sp.toString()); fn(p); p.delete("page"); start(() => router.push(path + (p.toString() ? "?" + p : ""), { scroll: false })); };
  const toggle = (k: string, v: string) => push((p) => { const all = p.getAll(k); p.delete(k); (all.includes(v) ? all.filter((x) => x !== v) : [...all, v]).forEach((x) => p.append(k, x)); });
  return { sp, push, toggle, pending };
}
function Group({ title, k, options }: { title: string; k: string; options: string[] }) {
  const { sp, toggle } = useParams(); const sel = sp.getAll(k);
  return <fieldset className="border-b border-line py-5"><legend className="mb-3 text-sm font-semibold">{title}</legend><div className="space-y-2">{options.map((o) => <label key={o} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80 hover:text-ink"><input type="checkbox" checked={sel.includes(o)} onChange={() => toggle(k, o)} className="h-4 w-4 rounded border-line accent-[var(--color-brand)]" />{o}</label>)}</div></fieldset>;
}
export function SearchBar() {
  const { sp, push, pending } = useParams(); const [v, setV] = useState(sp.get("q") || "");
  useEffect(() => setV(sp.get("q") || ""), [sp]);
  return <form role="search" onSubmit={(e) => { e.preventDefault(); push((p) => (v.trim() ? p.set("q", v.trim()) : p.delete("q"))); }} className="relative">
    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
    <input value={v} onChange={(e) => setV(e.target.value)} aria-label="Search templates" placeholder="Search by name, category, industry or keyword…" className="h-14 w-full rounded-full border border-line bg-white pl-13 pr-32 text-base outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" style={{ paddingLeft: "3.25rem" }} />
    <Button type="submit" className="absolute right-2 top-2 h-10">{pending ? "Searching…" : "Search"}</Button></form>;
}
export function SortSelect() {
  const { sp, push } = useParams();
  return <label className="flex items-center gap-2 text-sm text-muted">Sort<select value={sp.get("sort") || "featured"} onChange={(e) => push((p) => p.set("sort", e.target.value))} className="h-10 rounded-full border border-line bg-white px-4 text-sm text-ink outline-none focus:border-brand">{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>;
}
export function FilterPanel() {
  const { sp, push } = useParams(); const [open, setOpen] = useState(false);
  const [min, setMin] = useState(sp.get("min") || ""); const [max, setMax] = useState(sp.get("max") || "");
  useEffect(() => { setMin(sp.get("min") || ""); setMax(sp.get("max") || ""); }, [sp]);
  const active = ["category", "type", "style", "tech", "features", "min", "max", "badge", "q"].reduce((n, k) => n + sp.getAll(k).length, 0);
  const body = <>
    <Group title="Category / industry" k="category" options={CATEGORIES.map((c) => c.name)} />
    <Group title="Design style" k="style" options={STYLES} /><Group title="Technology" k="tech" options={TECHS} /><Group title="Features" k="features" options={FEATURES} />
    <div className="py-5"><div className="mb-3 text-sm font-semibold">Price range</div>
      <div className="flex items-center gap-2"><input inputMode="numeric" aria-label="Minimum price" placeholder="$ Min" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} className="h-10 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-brand" /><span className="text-muted">–</span><input inputMode="numeric" aria-label="Maximum price" placeholder="$ Max" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} className="h-10 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-brand" /></div>
      <Button v="outline" s="sm" className="mt-3 w-full" onClick={() => push((p) => { min ? p.set("min", min) : p.delete("min"); max ? p.set("max", max) : p.delete("max"); })}>Apply price</Button>
      <div className="mt-3 flex flex-wrap gap-2">{[["Under $60", "", "60"], ["$60–$100", "60", "100"], ["$100+", "100", ""]].map(([l, a, b]) => <button key={l} onClick={() => push((p) => { a ? p.set("min", a) : p.delete("min"); b ? p.set("max", b) : p.delete("max"); })} className="rounded-full border border-line px-3 py-1 text-xs hover:border-ink/30">{l}</button>)}</div></div>
  </>;
  return <>
    <button onClick={() => setOpen(true)} className="flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm lg:hidden"><SlidersHorizontal size={15} />Filters{active > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-[11px] text-white">{active}</span>}</button>
    <aside className="hidden lg:block"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Filters</h2>{active > 0 && <button onClick={() => push((p) => { [...p.keys()].forEach((k) => k !== "sort" && p.delete(k)); })} className="text-xs text-brand hover:underline">Clear all</button>}</div>{body}</aside>
    {open && <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters"><div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-bg"><div className="flex items-center justify-between border-b border-line p-5"><h2 className="font-semibold">Filters</h2><button aria-label="Close filters" onClick={() => setOpen(false)}><X size={20} /></button></div><div className="flex-1 overflow-y-auto px-5">{body}</div><div className="flex gap-3 border-t border-line p-4"><Button v="outline" className="flex-1" onClick={() => push((p) => { [...p.keys()].forEach((k) => k !== "sort" && p.delete(k)); })}>Clear</Button><Button className="flex-1" onClick={() => setOpen(false)}>Show results</Button></div></div></div>}
  </>;
}
export function Pager({ page, pages }: { page: number; pages: number }) {
  const sp = useSearchParams(); const router = useRouter(); const path = usePathname();
  const go = (n: number) => { const p = new URLSearchParams(sp.toString()); n > 1 ? p.set("page", String(n)) : p.delete("page"); router.push(path + (p.toString() ? "?" + p : ""), { scroll: true }); };
  if (pages <= 1) return null;
  return <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2"><Button v="outline" s="sm" disabled={page <= 1} onClick={() => go(page - 1)}>Previous</Button>{Array.from({ length: pages }, (_, i) => i + 1).map((n) => <button key={n} aria-current={n === page ? "page" : undefined} onClick={() => go(n)} className={"h-9 w-9 rounded-full text-sm transition " + (n === page ? "bg-ink text-white" : "hover:bg-black/5")}>{n}</button>)}<Button v="outline" s="sm" disabled={page >= pages} onClick={() => go(page + 1)}>Next</Button></nav>;
}
