import { AdvertCard } from "@/app/components/sections/AdvertCard";
import { AdvantageCard } from "@/app/components/sections/AdvantageCard";
import { CategoryCard } from "@/app/components/sections/CategoryCard";
import { Offer } from "@/app/components/sections/Offer";
import { ProductCard } from "@/app/components/sections/ProductCard";
import { ProductsSection } from "@/app/components/sections/ProductsSection";
import { ViewAllFooter } from "@/app/components/sections/home/ViewAllFooter";
import { HOME_BRANDS } from "@/app/lib/constants/mockCategories";
import { getCategories, getLaptops } from "@/app/lib/supabase/queries";
import { Category, Laptop } from "@/app/lib/constants/models";
import Link from "next/link";

export async function HomeContent() {
  // Fetch laptops on the server
  let laptops: Laptop[] = [];
  try {
    laptops = await getLaptops({ limit: 10, isAvailable: true });
  } catch (error) {
    console.error("Error fetching laptops:", error);
    laptops = [];
  }

  let gaming_laptops: Laptop[] = [];
  try {
    gaming_laptops = await getLaptops({
      limit: 6,
      isAvailable: true,
      categoryId: 1,
    });
  } catch (error) {
    console.error("Error fetching gaming laptops:", error);
    gaming_laptops = [];
  }

  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories = [];
  }
  return (
    <div className="space-y-10">
      <ProductsSection
        kickerKey="home.brands"
        titleKey="home.browseByBrands"
        scrollable
      >
        {HOME_BRANDS.map((c) => (
          <Link key={c.id} href={`/search?brand=${c.name}`}>
            <CategoryCard
              key={c.id}
              category={c}
              image_src={`/images/brands/${c.name}.svg`}
              imageClassName={c.invertDark ? "invert-dark" : undefined}
            />
          </Link>
        ))}
      </ProductsSection>

      <div className="border-t border-border" />

      <ProductsSection
        kickerKey="home.todays"
        titleKey="home.flashSales"
        scrollable
        footer={<ViewAllFooter href="" />}
      >
        {laptops.map((p) => (
          <ProductCard key={p.id} laptop={p} />
        ))}
      </ProductsSection>

      <div className="border-t border-border" />

      <ProductsSection
        kickerKey="home.categories"
        titleKey="home.browseByCategory"
        scrollable
      >
        {categories.map((c) => (
          <Link key={c.id} href={`/search?categoryId=${c.id}`}>
            <CategoryCard
              key={c.id}
              category={c}
              image_src={`/images/categories/${c.name}.svg`}
              imageClassName={c.invertDark ? "invert-dark" : undefined}
            />
          </Link>
        ))}
      </ProductsSection>

      <div className="border-t border-border" />

      <Offer
        imageSrc="https://laptop.sy/wp-content/uploads/2025/10/Apple-MacBook-MV942LL-3-1-400x400.jpg.webp"
        // countdownTo={{ day: 20, month: 3, year: 2026 }}
        href="/product/7"
      />

      <div className="border-t border-border" />

      <ProductsSection
        kickerKey="home.gaming"
        titleKey="home.exploreGamingLaptops"
        scrollable
        footer={<ViewAllFooter href="/search?categoryId=1" />}
      >
        {gaming_laptops.map((p) => (
          <ProductCard key={p.id} laptop={p} />
        ))}
      </ProductsSection>

      <div className="border-t border-border" />

      <div className="grid gap-4 md:grid-cols-3">
        <AdvantageCard
          icon="review"
          titleKey="home.advantages.compReview"
          textKey="home.advantages.compReviewText"
        />
        <AdvantageCard
          icon="headset"
          titleKey="home.advantages.priceComparison"
          textKey="home.advantages.priceComparisonText"
        />
        <AdvantageCard
          icon="scale"
          titleKey="home.advantages.unbiasedInfo"
          textKey="home.advantages.unbiasedInfoText"
        />
      </div>
    </div>
  );
}
