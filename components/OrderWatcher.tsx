"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./Providers";
export function OrderWatcher({ id, status }: { id: string; status: string }) {
  const router = useRouter(); const { clearCart } = useApp();
  useEffect(() => { if (status === "paid") { clearCart(); return; } if (status !== "pending") return; let n = 0; const t = setInterval(async () => { n++; const d = await (await fetch(`/api/orders/${id}/verify`)).json(); if (d.status !== "pending" || n > 20) { clearInterval(t); router.refresh(); } }, 2000); return () => clearInterval(t); }, [id, status]);
  return null;
}
