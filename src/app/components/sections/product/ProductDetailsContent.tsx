"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { IconHeart, IconTrash } from "@/app/components/ui/Icon";
import { RatingStars } from "@/app/components/ui/RatingStars";
import type { LaptopWithDetails } from "@/app/lib/constants/models";
import {
  addToFavorite,
  isFavorite,
  removeFromFavorite,
} from "@/app/utils/favorite";
import Link from "next/link";

export function ProductDetailsContent({
  product,
}: {
  product: LaptopWithDetails;
}) {
  const { t } = useI18n();

  const sortedImages = useMemo(() => {
    if (!product.images?.length) return ["/images/vercel.svg"];
    return [...product.images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.image_url);
  }, [product.images]);
  const [imageShown, setImageShown] = useState(sortedImages[0]);
  const [isFavoriteState, setIsFavoriteState] = useState(
    isFavorite(product.id),
  );
  const imagesRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsFavoriteState(isFavorite(product.id));
  }, [product.id]);

  const overallScore = product.scores?.overall_score ?? 0;
  const rateValue = Math.min(5, Math.max(0, Math.round(overallScore / 20))) as
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5;

  return (
    <div className="space-y-6">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* images */}
        <div ref={imagesRef}>
          <div className="rounded-3xl border border-border bg-muted/10 p-6">
            <div className="flex items-center justify-center">
              <Image
                src={imageShown}
                alt={product.title}
                width={520}
                height={420}
                className="h-auto max-h-[340px] w-auto object-contain"
                priority
              />
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sortedImages.map((img, idx) => {
                const selected = img === imageShown;
                return (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    className={[
                      "shrink-0 rounded-2xl border p-2 transition",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-muted/20",
                    ].join(" ")}
                    onClick={() => setImageShown(img)}
                    aria-label={t("a11y.selectProductImage", {
                      index: idx + 1,
                    })}
                  >
                    <Image
                      src={img}
                      alt=""
                      width={72}
                      height={72}
                      className="h-16 w-16 object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          {product.description && (
            <div className="mt-4 space-y-2">
              <div className="whitespace-pre-wrap p-6 text-sm rounded-3xl bg-muted">
                {product.description}
              </div>
            </div>
          )}
        </div>

        {/* details */}
        <div
          ref={detailsRef}
          className="rounded-3xl border border-border bg-background p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {product.title}
              </h1>
              {product.brand && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.brand} {product.model && `- ${product.model}`}
                </p>
              )}
            </div>
            {product.source?.logo_url && (
              <Image
                src={product.source.logo_url}
                alt={product.source.name}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            )}
          </div>

          <div className="mt-3">
            <RatingStars value={rateValue} />
            {product.scores && (
              <p className="mt-1 text-xs text-muted-foreground">
                Overall Score: {product.scores.overall_score}/100
              </p>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-foreground">
              {product.price?.toLocaleString()} {product.currency}
            </p>
            {!product.is_available && (
              <span className="text-sm text-red-500">
                {t("productDetails.outOfStock")}
              </span>
            )}
          </div>

          {/* Specifications */}
          {product.specs && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                {t("productDetails.specifications")}
              </h3>
              <div className="grid gap-2 text-sm">
                {product.specs.cpu && (
                  <div className="flex justify-between gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2">
                    <span className="font-medium text-foreground/80">
                      {t("specs.cpu")}
                    </span>
                    <span className="text-foreground">{product.specs.cpu}</span>
                  </div>
                )}
                {product.specs.gpu && (
                  <div className="flex justify-between gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2">
                    <span className="font-medium text-foreground/80">
                      {t("specs.gpu")}
                    </span>
                    <span className="text-foreground">
                      {product.specs.gpu}{" "}
                      {product.specs.gpu_gb && `${product.specs.gpu_gb} GB`}
                    </span>
                  </div>
                )}
                {product.specs.ram_gb && (
                  <div className="flex justify-between gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2">
                    <span className="font-medium text-foreground/80">
                      {t("specs.ram")}
                    </span>
                    <span className="text-foreground">
                      {product.specs.ram_gen} {product.specs.ram_gb} GB
                    </span>
                  </div>
                )}
                {product.specs.storage_gb && (
                  <div className="flex justify-between gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2">
                    <span className="font-medium text-foreground/80">
                      {t("specs.storage")}
                    </span>
                    <span className="text-foreground">
                      {product.specs.storage_type} {product.specs.storage_gb} GB
                    </span>
                  </div>
                )}
                {product.specs.screen_size && (
                  <div className="flex justify-between gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2">
                    <span className="font-medium text-foreground/80">
                      {t("specs.screen")}
                    </span>
                    <span className="text-foreground">
                      {product.specs.screen_size}"{" "}
                      {product.specs.screen_resolution}
                      {product.specs.refresh_rate &&
                        ` @ ${product.specs.refresh_rate}Hz`}
                    </span>
                  </div>
                )}
                {product.specs.os && (
                  <div className="flex justify-between gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2">
                    <span className="font-medium text-foreground/80">
                      {t("specs.os")}
                    </span>
                    <span className="text-foreground">{product.specs.os}</span>
                  </div>
                )}
                {product.specs.weight_kg && (
                  <div className="flex justify-between gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2">
                    <span className="font-medium text-foreground/80">
                      {t("specs.weight")}
                    </span>
                    <span className="text-foreground">
                      {product.specs.weight_kg} kg
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Usage Scores */}
          {product.scores && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                {t("productDetails.usageScores")}
              </h3>
              <div className="grid gap-2 text-sm">
                {product.scores.office_score !== null && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground/80">
                      {t("scores.office")}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${product.scores.office_score}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-medium text-foreground">
                        {product.scores.office_score}
                      </span>
                    </div>
                  </div>
                )}
                {product.scores.gaming_score !== null && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground/80">
                      {t("scores.gaming")}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${product.scores.gaming_score}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-medium text-foreground">
                        {product.scores.gaming_score}
                      </span>
                    </div>
                  </div>
                )}
                {product.scores.editing_score !== null && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground/80">
                      {t("scores.editing")}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${product.scores.editing_score}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-medium text-foreground">
                        {product.scores.editing_score}
                      </span>
                    </div>
                  </div>
                )}
                {product.scores.programming_score !== null && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground/80">
                      {t("scores.programming")}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${product.scores.programming_score}%`,
                          }}
                        />
                      </div>
                      <span className="w-12 text-right font-medium text-foreground">
                        {product.scores.programming_score}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="my-6 border-t border-border" />

          <div className="flex flex-wrap items-center gap-3">
            <Link href='/compare' className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary/5">
              {t("productDetails.compareLaptop")}
            </Link>
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={
                isFavoriteState
                  ? t("a11y.removeFromFavorite")
                  : t("a11y.addToFavorite")
              }
              onClick={() => {
                if (isFavoriteState) {
                  removeFromFavorite(product.id);
                } else {
                  addToFavorite([product.id]);
                }
                setIsFavoriteState(isFavorite(product.id));
              }}
            >
              {isFavoriteState
                ? t("a11y.removeFromFavorite")
                : t("a11y.addToFavorite")}
              {isFavoriteState ? (
                <IconTrash className="h-4 min-w-4 max-w-4" />
              ) : (
                <IconHeart className="h-4 min-w-4 max-w-4" />
              )}
            </button>
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              {t("productDetails.viewOnSource")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
