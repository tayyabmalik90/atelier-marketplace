import { q } from "@/lib/db";
import type { Template } from "@/lib/templates";
import { CATEGORIES } from "@/lib/utils";
import { Hero } from "@/components/Hero";
import { Categories, FinalCTA, How, Marquee, Stats, Testimonials, Why, SectionHead } from "@/components/Sections";
import { TemplateCard } from "@/components/TemplateCard";
import { Container, LinkButton } from "@/components/ui";
export const dynamic = "force-dynamic";
export default async function Home() {
  const featured = await q<Template>("select * from templates where status='published' order by (badge='featured') desc, sales desc limit 6");
  const cats = await q<{ category: string; n: number }>("select category, count(*)::int n from templates where status='published' group by category");
  const [tot] = await q<{ n: number; s: number }>("select count(*)::int n, coalesce(sum(sales),0)::int s from templates where status='published'");
  const counts = Object.fromEntries(cats.map((c) => [c.category, c.n]));
  return <>
    <Hero shots={featured.slice(0, 3).map((t) => t.preview_url)} />
    <Marquee items={CATEGORIES.map((c) => c.name)} />
    <Categories counts={counts} />
    <section className="pb-24"><Container><SectionHead eyebrow="Featured" title="Hand-picked templates" sub="Our most loved designs, each with a working live demo." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featured.map((t, i) => <TemplateCard key={t.id} t={t} i={i} />)}</div>
      <div className="mt-12 text-center"><LinkButton href="/templates" v="outline" s="lg">View all templates</LinkButton></div></Container></section>
    <Why /><How /><Stats templates={tot.n} sales={tot.s} /><Testimonials /><FinalCTA />
  </>;
}
