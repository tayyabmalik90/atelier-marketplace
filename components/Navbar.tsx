"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Menu, ShoppingBag, X, Heart } from "lucide-react";
import { useApp } from "./Providers";
import { LinkButton } from "./ui";
const links = [["Templates", "/templates"], ["Categories", "/#categories"], ["How it works", "/#how"], ["FAQs", "/faqs"]];
export function Navbar() {
  const { me, cart, wishlist } = useApp(); const [s, setS] = useState(false); const [open, setOpen] = useState(false); const path = usePathname(); const router = useRouter();
  useEffect(() => { const f = () => setS(scrollY > 12); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  useEffect(() => setOpen(false), [path]);
  if (path.startsWith("/preview")) return null;
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); location.href = "/"; };
  return (
    <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={"sticky top-0 z-50 transition-all " + (s ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "")}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-white focus:p-2">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-display text-3xl font-semibold tracking-tight">Atelier<span className="text-brand">.</span></Link>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">{links.map(([l, h]) => <Link key={h} href={h} className="group relative text-sm text-ink/70 transition hover:text-ink">{l}<span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all group-hover:w-full" /></Link>)}</nav>
        <div className="flex items-center gap-1.5">
          <Link href="/dashboard/wishlist" aria-label="Wishlist" className="relative hidden rounded-full p-2.5 transition hover:bg-black/5 sm:block"><Heart size={18} />{wishlist.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand" />}</Link>
          <Link href="/cart" aria-label={`Cart, ${cart.length} items`} className="relative rounded-full p-2.5 transition hover:bg-black/5"><ShoppingBag size={18} />{cart.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">{cart.length}</span>}</Link>
          {me ? (<><Link href={me.role === "admin" ? "/admin" : "/dashboard"} className="ml-1 hidden rounded-full border border-line bg-white px-4 py-2 text-sm transition hover:border-ink/30 sm:block">{me.role === "admin" ? "Admin" : "Dashboard"}</Link><button onClick={logout} className="hidden px-3 text-sm text-muted hover:text-ink md:block">Sign out</button></>)
            : (<><Link href="/login" className="hidden px-3 text-sm text-ink/70 hover:text-ink sm:block">Log in</Link><LinkButton href="/signup" s="sm" className="hidden sm:inline-flex">Sign up</LinkButton></>)}
          <button aria-label="Menu" aria-expanded={open} className="rounded-full p-2.5 hover:bg-black/5 md:hidden" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {open && <div className="border-t border-line bg-bg px-5 py-4 md:hidden"><div className="flex flex-col gap-1">{links.map(([l, h]) => <Link key={h} href={h} className="rounded-xl px-3 py-3 text-base hover:bg-black/5">{l}</Link>)}{me ? <><Link href={me.role === "admin" ? "/admin" : "/dashboard"} className="rounded-xl px-3 py-3 hover:bg-black/5">{me.role === "admin" ? "Admin" : "Dashboard"}</Link><button onClick={logout} className="rounded-xl px-3 py-3 text-left hover:bg-black/5">Sign out</button></> : <><Link href="/login" className="rounded-xl px-3 py-3 hover:bg-black/5">Log in</Link><Link href="/signup" className="rounded-xl px-3 py-3 font-medium hover:bg-black/5">Sign up</Link></>}</div></div>}
    </motion.header>
  );
}
