"use client";

import { useI18n } from "@/app/components/i18n/I18nProvider";
import { ProductCard } from "@/app/components/sections/ProductCard";
import { ProductsSection } from "@/app/components/sections/ProductsSection";
import { Laptop } from "@/app/lib/constants/models";
import { getFavoriteLaptops } from "@/app/utils/favorite";
import { get } from "http";
import { useState } from "react";

export function FavoriteContent(props: { laptops: Laptop[] }) {
  const { t } = useI18n();
  const [favorite, setFavorite] = useState(getFavoriteLaptops(props.laptops));
  const relative: Laptop[] = [];
  try{
    for(const fav of favorite){
      const rel = props.laptops.filter(l => l.brand === fav.brand && l.id !== fav.id);
      relative.push(...rel);
    }
  }
  catch(error){
    console.error("Error fetching relative laptops:", error);
  }

  const refreshFavorite = () => {
    setFavorite(getFavoriteLaptops(props.laptops));
  }
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("favorite.title", { count: favorite.length })}
        </h1>
        <div className="mt-6 flex flex-wrap gap-4">
          {favorite.map((p) => (
            <ProductCard key={p.id} laptop={p}  refreshFavorite={refreshFavorite}/>
          ))}
        </div>
      </section>

      <ProductsSection kickerKey="favorite.relative" titleKey="favorite.justForYou" scrollable>
        {relative.map((p) => (
          <ProductCard key={p.id} laptop={p}  refreshFavorite={refreshFavorite}/>
        ))}
      </ProductsSection>
    </div>
  );
}

