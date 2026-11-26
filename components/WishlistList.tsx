"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useApp } from "./Providers";
import { Button, Empty, LinkButton } from "./ui";
import { money } from "@/lib/utils";
export function WishlistList({ items }: { items: any[] }) {
  const [list, setList] = useState(items); const { toggleWish, addCart } = useApp(); const router = useRouter();
  if (!list.length) return <Empty title="Your wishlist is empty" body="Tap the heart on any template to save it for later." action={<LinkButton href="/templates" v="brand">Explore Templates</LinkButton>} />;
  return <ul className="space-y-4">{list.map((t) => <li key={t.id} className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-4 sm:flex-row sm:items-center"><div className="relative aspect-[8/5.2] w-full overflow-hidden rounded-2xl sm:w-44"><Image src={t.preview_url} alt="" fill sizes="176px" className="object-cover" unoptimized /></div>
    <div className="flex-1"><Link href={`/templates/${t.slug}`} className="text-lg font-semibold hover:underline">{t.name}</Link><p className="text-sm text-muted">{t.category} · {money(t.price_cents)}</p></div>
    <div className="flex gap-2"><Button v="brand" onClick={() => { addCart(t.id); router.push("/cart"); }}>Buy now</Button><Button v="outline" aria-label={`Remove ${t.name}`} onClick={async () => { await toggleWish(t.id); setList(list.filter((x) => x.id !== t.id)); }}><Trash2 size={15} /></Button></div></li>)}</ul>;
}
