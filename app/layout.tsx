import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: { default: "Atelier — Premium pre-built websites", template: "%s · Atelier" },
  description: "Browse, preview and buy professionally designed website templates at one fixed price. Live demos, instant download.",
  openGraph: { title: "Atelier — Premium pre-built websites", description: "Preview live. Buy once. Launch today.", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Providers><Navbar /><main id="main">{children}</main><Footer /></Providers></body></html>;
}
