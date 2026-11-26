import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { Container } from "@/components/ui";
export const dynamic = "force-dynamic";
const nav = [["Overview", "/dashboard"], ["My purchases", "/dashboard/purchases"], ["Wishlist", "/dashboard/wishlist"], ["Account settings", "/dashboard/settings"]];
export default async function L({ children }: { children: React.ReactNode }) {
  const u = await getUser(); if (!u) redirect("/login?next=/dashboard");
  return <Container className="grid gap-8 py-10 md:grid-cols-[220px_1fr]"><aside><nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto md:flex-col">{nav.map(([l, h]) => <Link key={h} href={h} className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm text-ink/70 transition hover:bg-black/5 hover:text-ink">{l}</Link>)}</nav></aside><div>{children}</div></Container>;
}
