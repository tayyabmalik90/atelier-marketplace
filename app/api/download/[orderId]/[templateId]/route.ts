import { NextResponse } from "next/server";
import { one } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { buildBundle } from "@/lib/bundle";
import { getTemplate } from "@/lib/templates";
import { q } from "@/lib/db";
export async function GET(_: Request, { params }: { params: Promise<{ orderId: string; templateId: string }> }) {
  const { orderId, templateId } = await params;
  const u = await getUser(); if (!u) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!/^[0-9a-f-]{36}$/.test(orderId) || !/^\d+$/.test(templateId)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const row = await one("select 1 from orders o join order_items oi on oi.order_id=o.id where o.id=$1 and o.user_id=$2 and o.status='paid' and oi.template_id=$3", [orderId, u.id, Number(templateId)]);
  if (!row) return NextResponse.json({ error: "No paid order found for this template" }, { status: 403 });
  const t = (await q<any>("select * from templates where id=$1", [Number(templateId)]))[0]; if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data, name } = await buildBundle(t);
  return new NextResponse(new Uint8Array(data), { headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "private, no-store" } });
}
