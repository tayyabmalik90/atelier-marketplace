export type Template = {
  id: number; slug: string; name: string; description: string; category: string; type: string; style: string;
  tech: string[]; features: string[]; tags: string[]; price_cents: number; preview_url: string; screenshots: string[];
  demo_url: string; file_path: string | null; badge: string; status: string; sales: number; created_at: string;
};
export const isNew = (t: Template) => Date.now() - new Date(t.created_at).getTime() < 14 * 86400000;
export const label = (t: Template) => (t.badge === "featured" ? "Featured" : t.badge === "popular" ? "Popular" : t.badge === "new" || isNew(t) ? "New" : "");
