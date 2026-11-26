import type { Metadata } from "next";
import { searchTemplates } from "@/lib/templates";
import { TemplateCard } from "@/components/TemplateCard";
import { FilterPanel, Pager, SearchBar, SortSelect } from "@/components/Filters";
import { Container, Empty, LinkButton } from "@/components/ui";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
const arr = (v?: string | string[]) => (v == null ? [] : Array.isArray(v) ? v : [v]);
export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }): Promise<Metadata> {
  const c = arr((await searchParams).category)[0];
  return { title: c ? `${c} website templates` : "Website templates", description: c ? `Premium ${c} website templates with live demos. One fixed price.` : "Browse premium website templates. Filter by industry, style, technology and features." };
}
export default async function Marketplace({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  const sp = await searchParams;
  const num = (v: any) => (v !== undefined && v !== "" && !isNaN(Number(v)) ? Number(v) : undefined);
  const r = await searchTemplates({ q: arr(sp.q)[0], category: arr(sp.category), type: arr(sp.type), style: arr(sp.style), tech: arr(sp.tech), features: arr(sp.features), min: num(sp.min), max: num(sp.max), sort: arr(sp.sort)[0], page: num(sp.page), badge: arr(sp.badge)[0], per: 9 });
  return <Container className="py-10 sm:py-14">
    <div className="mb-8 max-w-2xl"><h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">Template marketplace</h1><p className="mt-3 text-muted">Every template has a working live demo and one fixed price.</p></div>
    <Suspense><SearchBar /></Suspense>
    <div className="mt-8 grid gap-10 lg:grid-cols-[250px_1fr]">
      <Suspense><div><FilterPanel /></div></Suspense>
      <div><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted" aria-live="polite"><b className="text-ink">{r.total}</b> template{r.total === 1 ? "" : "s"}</p><Suspense><SortSelect /></Suspense></div>
        {r.rows.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{r.rows.map((t, i) => <TemplateCard key={t.id} t={t} i={i} />)}</div>
          : <Empty title="No templates found" body="Try removing a filter or searching with a different keyword." action={<LinkButton href="/templates" v="outline">Clear all filters</LinkButton>} />}
        <Suspense><Pager page={r.page} pages={r.pages} /></Suspense></div></div></Container>;
}
