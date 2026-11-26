import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
export const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const dateFmt = (d: string | Date) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
export const CATEGORIES = [
  { name: "Business & Corporate", slug: "business", blurb: "Trusted sites for firms and services" },
  { name: "Portfolio & Personal Branding", slug: "portfolio", blurb: "Showcase your work and story" },
  { name: "SaaS & Technology", slug: "saas", blurb: "Product sites for software teams" },
  { name: "E-commerce", slug: "ecommerce", blurb: "Storefronts built to convert" },
  { name: "Agency & Creative Studio", slug: "agency", blurb: "Bold sites for creative teams" },
  { name: "Real Estate", slug: "real-estate", blurb: "Listings and agent profiles" },
  { name: "Restaurant & Hospitality", slug: "restaurant", blurb: "Menus, bookings and atmosphere" },
  { name: "Education & Online Courses", slug: "education", blurb: "Courses, cohorts and instructors" },
  { name: "Landing Pages", slug: "landing", blurb: "One page, one goal" },
  { name: "Blogs & Publications", slug: "blogs", blurb: "Reading-first publishing" },
];
export const STYLES = ["Minimal", "Modern", "Corporate", "Creative", "Luxury"];
export const TECHS = ["HTML", "React", "Next.js", "WordPress", "Webflow"];
export const FEATURES = ["Responsive", "CMS", "Blog", "E-commerce", "Animation"];
export const TYPES = ["Corporate Website", "Portfolio", "SaaS Landing", "Online Store", "Agency Website", "Listings Website", "Restaurant Website", "Course Platform", "Landing Page", "Magazine", "Cafe Website"];
