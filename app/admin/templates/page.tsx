import Link from "next/link";
import Image from "next/image";
import { q } from "@/lib/db";
import type { Template } from "@/lib/templates";
import { ArchiveButton } from "@/components/AdminActions";
import { Badge, LinkButton } from "@/components/ui";
import { money } from "@/lib/utils";
export default async function Page() {
  const rows = await q<Template>("select * from templates order by created_at desc");
  return <div><div className="mb-8 flex items-center justify-between"><h1 className="font-display text-5xl font-semibold">Templates</h1><LinkButton href="/admin/templates/new" v="brand">Add template</LinkButton></div>
    <div className="overflow-x-auto rounded-3xl border border-line bg-white"><table className="w-full text-sm"><thead className="text-left text-xs text-muted"><tr><th className="p-4">Template</th><th>Category</th><th>Price</th><th>Sales</th><th>Status</th><th /></tr></thead><tbody>{rows.map((t) => <tr key={t.id} className="border-t border-line"><td className="p-3"><div className="flex items-center gap-3"><div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-lg"><Image src={t.preview_url || "/previews/folio-1.svg"} alt="" fill sizes="64px" className="object-cover" unoptimized /></div><Link href={`/admin/templates/${t.id}`} className="font-medium hover:underline">{t.name}</Link>{t.badge && <Badge tone="brand">{t.badge}</Badge>}</div></td><td className="max-w-40 truncate">{t.category}</td><td>{money(t.price_cents)}</td><td>{t.sales}</td><td><Badge tone={t.status === "published" ? "ok" : "plain"}>{t.status}</Badge></td><td className="space-x-2 p-3 text-right"><Link href={`/admin/templates/${t.id}`} className="text-brand hover:underline">Edit</Link><ArchiveButton id={t.id} status={t.status} /></td></tr>)}</tbody></table></div></div>;
}
