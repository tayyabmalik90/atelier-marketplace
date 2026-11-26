"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui";
export function RefundButton({ id }: { id: string }) {
  const r = useRouter(); const [b, setB] = useState(false);
  return <Button s="sm" v="danger" disabled={b} onClick={async () => { if (!confirm("Refund this order? The customer loses download access.")) return; setB(true); const d = await (await fetch(`/api/admin/orders/${id}/refund`, { method: "POST" })).json(); if (!d.ok) alert(d.error); r.refresh(); setB(false); }}>{b ? "Refunding…" : "Refund"}</Button>;
}
export function ArchiveButton({ id, status }: { id: number; status: string }) {
  const r = useRouter();
  if (status !== "published") return <Button s="sm" v="outline" onClick={async () => { const t = await (await fetch(`/api/admin/templates/${id}`)).text(); r.push(`/admin/templates/${id}`); }}>Restore…</Button>;
  return <Button s="sm" v="danger" onClick={async () => { if (!confirm("Archive this template? It will be hidden from the marketplace; past buyers keep access.")) return; await fetch(`/api/admin/templates/${id}`, { method: "DELETE" }); r.refresh(); }}>Archive</Button>;
}
