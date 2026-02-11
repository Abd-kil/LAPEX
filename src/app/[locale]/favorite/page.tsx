import { FavoriteContent } from "@/app/components/sections/favorite/FavoriteContent";
import { getLaptops } from "@/app/lib/supabase/queries";

export default async function favoritePage() {
  const allLaptops = await getLaptops();
  return <FavoriteContent laptops={allLaptops} />;
}
