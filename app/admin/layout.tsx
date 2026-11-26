import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { Container } from "@/components/ui";
export const dynamic = "force-dynamic"; export const metadata = { title: "Admin", robots: { index: false } };
const nav = [["Overview", "/admin"], ["Templates", "/admin/templates"], ["Orders", "/admin/orders"], ["Customers", "/admin/customers"]];
export default async function L({ children }: { children: React.ReactNode }) {
  if (!(await requireAdmin())) notFound();
  return <Container className="grid gap-8 py-10 md:grid-cols-[200px_1fr]"><aside><div className="mb-3 px-4 text-xs font-semibold uppercase tracking-widest text-brand">Admin</div><nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col">{nav.map(([l, h]) => <Link key={h} href={h} className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm text-ink/70 hover:bg-black/5 hover:text-ink">{l}</Link>)}</nav></aside><div className="min-w-0">{children}</div></Container>;
}
