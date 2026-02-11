"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { IconHeart, IconTrash } from "@/app/components/ui/Icon";
import { RatingStars } from "@/app/components/ui/RatingStars";
import type { LaptopWithDetails } from "@/app/lib/constants/models";
import { productDetailsHref } from "@/app/lib/i18n/routing";
import { addToFavorite, isFavorite, removeFromFavorite } from "@/app/utils/favorite";
import { useState } from "react";

export function ProductCard({ laptop, refreshFavorite }: { laptop: LaptopWithDetails; refreshFavorite?: ()=>void }) {
  const { locale, t } = useI18n();
  const href = productDetailsHref(locale, laptop.id);
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite(laptop.id));
  const primaryImage = laptop.image_url;

  const overallScore = laptop.scores?.overall_score ?? 0;
  const rateValue = Math.min(5, Math.max(0, Math.round(overallScore / 20))) as
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5;

  return (
    <article className="w-[190px] shrink-0 sm:w-[220px]">
      <Link href={href} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 p-4">
          {/* {favorite button} */}
          <button
            type="button"
            className="z-11 hover:bg-primary absolute end-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/85 text-foreground/80 backdrop-blur transition hover:text-foreground"
            data-no-loader="true"
            aria-label={
              isFavoriteState ? t("a11y.removeFromFavorite") : t("a11y.addToFavorite")
            }
            onClick={(e)=>{
              e.preventDefault();
              if (isFavoriteState) {
                removeFromFavorite(laptop.id);
              } else {
                addToFavorite([laptop.id]);
              }
              setIsFavoriteState(isFavorite(laptop.id));
              if (refreshFavorite) {
                refreshFavorite();
              }
            }}
          >
            {isFavoriteState ? (
              <IconTrash className="h-4 w-4" />
            ) : (
              <IconHeart className="h-4 w-4" />
            )}
          </button>

          <div className="flex h-[150px] items-center justify-center">
            <Image
              src={primaryImage}
              alt={laptop.title}
              width={160}
              height={130}
              className="z-10 h-auto max-h-[140px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-medium text-foreground">
          {laptop.title}
        </h3>
        <p className="mt-1 text-sm text-foreground/80">
          {laptop.price?.toLocaleString() ?? "N/A"} {laptop.currency || "USD"}
        </p>
        <div className="mt-2">
          <RatingStars value={rateValue} />
        </div>
      </Link>
    </article>
  );
}
