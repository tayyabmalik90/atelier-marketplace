"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
type Me = { id: string; name: string; email: string; role: string; verified: boolean } | null;
type Ctx = { me: Me; wishlist: number[]; cart: number[]; loaded: boolean; addCart: (id: number) => void; removeCart: (id: number) => void; clearCart: () => void; toggleWish: (id: number) => Promise<boolean>; toast: (m: string) => void };
const C = createContext<Ctx>(null as any);
export const useApp = () => useContext(C);
export function Providers({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Me>(null); const [wishlist, setW] = useState<number[]>([]); const [cart, setCart] = useState<number[]>([]); const [loaded, setLoaded] = useState(false); const [msg, setMsg] = useState("");
  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem("cart") || "[]")); } catch {} fetch("/api/me").then((r) => r.json()).then((d) => { setMe(d.user); setW(d.wishlist); setLoaded(true); }); }, []);
  const save = (c: number[]) => { setCart(c); localStorage.setItem("cart", JSON.stringify(c)); };
  const toast = useCallback((m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2600); }, []);
  const value: Ctx = {
    me, wishlist, cart, loaded, toast,
    addCart: (id) => { if (!cart.includes(id)) save([...cart, id]); toast("Added to cart"); },
    removeCart: (id) => save(cart.filter((i) => i !== id)), clearCart: () => save([]),
    toggleWish: async (id) => {
      if (!me) { toast("Sign in to save templates"); window.location.href = "/login?next=" + encodeURIComponent(location.pathname); return false; }
      const has = wishlist.includes(id);
      const r = await fetch("/api/wishlist", { method: has ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ templateId: id }) });
      if (r.ok) { setW(has ? wishlist.filter((i) => i !== id) : [...wishlist, id]); toast(has ? "Removed from wishlist" : "Saved to wishlist"); }
      return !has;
    },
  };
  return <C.Provider value={value}>{children}<div aria-live="polite" className={"pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-xl transition-all duration-300 " + (msg ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>{msg}</div></C.Provider>;
}
