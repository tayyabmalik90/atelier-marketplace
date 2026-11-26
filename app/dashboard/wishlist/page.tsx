import { getUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { WishlistList } from "@/components/WishlistList";
export const metadata = { title: "Wishlist" };
export default async function Page() {
  const u = (await getUser())!;
  const items = await q("select t.* from wishlist w join templates t on t.id=w.template_id where w.user_id=$1 and t.status='published' order by w.created_at desc", [u.id]);
  return <div><h1 className="mb-8 font-display text-5xl font-semibold">Wishlist</h1><WishlistList items={JSON.parse(JSON.stringify(items))} /></div>;
}
