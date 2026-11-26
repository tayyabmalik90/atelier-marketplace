import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { one } from "@/lib/db";
import { stripeEnabled } from "@/lib/stripe";
import { PayForm } from "@/components/PayForm";
export const dynamic = "force-dynamic"; export const metadata = { title: "Payment" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const u = await getUser(); if (!u) redirect("/login");
  if (!/^[0-9a-f-]{36}$/.test(id) || stripeEnabled()) notFound();
  const o = await one<any>("select id,status,total_cents from orders where id=$1 and user_id=$2", [id, u.id]); if (!o) notFound();
  if (o.status === "paid") redirect(`/order/${id}`);
  return <PayForm orderId={id} total={o.total_cents} />;
}
