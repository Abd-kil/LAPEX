"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import type { LaptopWithDetails } from "@/app/lib/constants/models";
import ProductCompareCard from "../../ui/ProductCompareCard";
import { getProductImage } from "@/app/utils/image";
import type { CompareRow, UsageDef } from "./utils";
import { formatValue, getStorageTypeRank, getRamGenRank } from "./utils";
import { ScoreBar, ScoreCircle } from "../../ui/ScoreProgress";
import CompareTableBlock, { SectionTitle } from "./CompareTableBlock";

const MAX_COMPARE = 2;

export function CompareContent({
  products,
}: {
  products: LaptopWithDetails[];
}) {
  const { t, locale } = useI18n();

  const { summaryRows, hardwareRows, displayRows, usageDefs } = useMemo(() => {
    const summary: CompareRow[] = [
      {
        id: "price",
        label: t("compare.price"),
        best: "min",
        getValue: (product) => product.price ?? null,
        render: (product) =>
          product.price != null
            ? `${product.price.toLocaleString()} ${product.currency}`
            : "-",
      },
      {
        id: "overall-score",
        label: t("compare.overallScore"),
        best: "max",
        getValue: (product) => product.scores?.overall_score ?? null,
        render: (product) => (
          <ScoreBar value={product.scores?.overall_score ?? null} />
        ),
      },
    ];

    const hardware: CompareRow[] = [
      {
        id: "cpu",
        label: t("specs.cpu"),
        best: "max",
        getValue: (product) => product.specs?.cpu_normalized_score ?? null,
        render: (product) => (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {product.specs?.cpu?.cpu_name ?? "-"}
            </p>
            <ScoreBar value={product.specs?.cpu_normalized_score ?? null} />
          </div>
        ),
      },
      {
        id: "gpu",
        label: t("specs.gpu"),
        best: "max",
        getValue: (product) => product.specs?.gpu_normalized_score ?? null,
        render: (product) => (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {product.specs?.gpu?.gpu_name
                ? product.specs.gpu_gb
                  ? `${product.specs.gpu.gpu_name} ${product.specs.gpu_gb} GB`
                  : product.specs.gpu.gpu_name
                : "-"}
            </p>
            <ScoreBar value={product.specs?.gpu_normalized_score ?? null} />
          </div>
        ),
      },
      {
        id: "ram-size",
        label: t("compare.ramSize"),
        best: "max",
        getValue: (product) => product.specs?.ram_gb ?? null,
        render: (product) => formatValue(product.specs?.ram_gb ?? null, "GB"),
      },
      {
        id: "ram-type",
        label: t("compare.ramType"),
        best: "max",
        getValue: (product) => getRamGenRank(product.specs?.ram_gen ?? null),
        getText: (product) => product.specs?.ram_gen ?? null,
      },
      {
        id: "storage-size",
        label: t("compare.storageSize"),
        best: "max",
        getValue: (product) => product.specs?.storage_gb ?? null,
        render: (product) =>
          formatValue(product.specs?.storage_gb ?? null, "GB"),
      },
      {
        id: "storage-type",
        label: t("compare.storageType"),
        best: "max",
        getValue: (product) =>
          getStorageTypeRank(product.specs?.storage_type ?? null),
        getText: (product) => product.specs?.storage_type ?? null,
      },
    ];

    const display: CompareRow[] = [
      {
        id: "screen-size",
        label: t("compare.screenSize"),
        best: "max",
        getValue: (product) => product.specs?.screen_size ?? null,
        render: (product) =>
          formatValue(product.specs?.screen_size ?? null, "in"),
      },
      {
        id: "screen-resolution",
        label: t("compare.screenResolution"),
        getText: (product) => product.specs?.screen_resolution ?? null,
      },
      {
        id: "refresh-rate",
        label: t("compare.refreshRate"),
        best: "max",
        getValue: (product) => product.specs?.refresh_rate ?? null,
        render: (product) =>
          formatValue(product.specs?.refresh_rate ?? null, "Hz"),
      },
      {
        id: "battery",
        label: t("compare.battery"),
        best: "max",
        getValue: (product) => product.specs?.battery_wh ?? null,
        render: (product) =>
          formatValue(product.specs?.battery_wh ?? null, "Wh"),
      },
      {
        id: "weight",
        label: t("compare.weight"),
        best: "min",
        getValue: (product) => product.specs?.weight_kg ?? null,
        render: (product) =>
          formatValue(product.specs?.weight_kg ?? null, "kg"),
      },
      {
        id: "os",
        label: t("compare.os"),
        getText: (product) => product.specs?.os ?? null,
      },
    ];

    const gaming: CompareRow = {
      id: "gaming-score",
      label: t("scores.gaming"),
      best: "max",
      getValue: (product) => product.scores?.gaming_score ?? null,
      render: (product) => (
        <ScoreCircle value={product.scores?.gaming_score ?? null} />
      ),
    };
    const office: CompareRow = {
      id: "office-score",
      label: t("scores.office"),
      best: "max",
      getValue: (product) => product.scores?.office_score ?? null,
      render: (product) => (
        <ScoreCircle value={product.scores?.office_score ?? null} />
      ),
    };
    const editing: CompareRow = {
      id: "editing-score",
      label: t("scores.editing"),
      best: "max",
      getValue: (product) => product.scores?.editing_score ?? null,
      render: (product) => (
        <ScoreCircle value={product.scores?.editing_score ?? null} />
      ),
    };
    const programming: CompareRow = {
      id: "programming-score",
      label: t("scores.programming"),
      best: "max",
      getValue: (product) => product.scores?.programming_score ?? null,
      render: (product) => (
        <ScoreCircle value={product.scores?.programming_score ?? null} />
      ),
    };

    const usage: UsageDef[] = [
      { row: gaming },
      { row: office },
      { row: editing },
      { row: programming },
    ];

    return {
      summaryRows: summary,
      hardwareRows: hardware,
      displayRows: display,
      usageDefs: usage,
    };
  }, [t]);

  if (!products.length) {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-border bg-background p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("compare.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("compare.subtitle", { count: MAX_COMPARE })}
          </p>
        </section>
        <section className="rounded-3xl border border-border bg-muted/10 p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {t("compare.emptyTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("compare.emptyText")}
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href={`/${locale}/search`}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {t("nav.search")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (products.length === 1) {
    const p = products[0];
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <section className="rounded-3xl border border-border bg-background p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("compare.title")}
          </h1>
        </section>
        <ProductCompareCard product={p} imageURL={getProductImage(p)} />
        <div className="flex justify-center px-4">
          <Link
            href={`/${locale}/search?compare=${p.id}`}
            className="inline-flex h-11 w-full max-w-sm items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:w-auto"
          >
            {t("nav.search")}
          </Link>
        </div>
      </div>
    );
  }

  const pair = products.slice(0, MAX_COMPARE);
  const compareHref = (id: number) => {
    const otherId = pair.filter((l) => l.id != id).map(l=>l.id);
    return `/${locale}/search?compare=${otherId}`;
  };

  // Determine the overall winner based on overall_score
  const winnerLaptop = useMemo(() => {
    if (pair.length < 2) return null;
    const scores = pair.map((p) => p.scores?.overall_score ?? -1);
    const maxScore = Math.max(...scores);
    return pair.find((p) => p.scores?.overall_score === maxScore) || null;
  }, [pair]);

  return (
    <div className="space-y-6">
      {/* Sticky intro + product strip (demo layout); theme stays default tokens */}
      <div className="sticky top-16 z-30 -mx-4 border-border border-b bg-background/95 px-4 py-5 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-0 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col justify-end lg:col-span-4">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {t("compare.title")}
            </h1>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-8">
            <div className="flex gap-4 items-stretch md:gap-4 lg:gap-6">
              {pair.map((laptop) => (
                <div key={laptop.id} className="min-h-0 min-w-0 flex-1">
                  <div className={winnerLaptop?.id === laptop.id ? "border-2 border-primary rounded-xl relative" : ""}>
                    {winnerLaptop?.id === laptop.id && (
                      <div className="absolute -top-2 right-4 bg-primary text-white text-[10px] py-0.5 px-2 font-bold uppercase tracking-widest rounded-xl">
                        Winner
                      </div>
                    )}

                    <ProductCompareCard
                      product={laptop}
                      imageURL={getProductImage(laptop)}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <Link
                      href={compareHref(laptop.id)}
                      className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {t("compare.remove")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-0 sm:px-1">
        {/* Usage scores: intro column + two product columns on large; stacked on mobile */}
        <section>
          <SectionTitle>{t("compare.usageScores")}</SectionTitle>
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="text-sm leading-relaxed text-muted-foreground lg:col-span-4">
              {t("compare.subtitle", { count: MAX_COMPARE })}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-2">
              {pair.map((product) => (
                <div
                  key={`usage-${product.id}`}
                  className="rounded-2xl border border-border bg-muted/10 p-4"
                >
                  <div className="mb-4 flex items-center gap-3 border-border border-b pb-3 lg:hidden">
                    <Image
                      src={getProductImage(product)}
                      alt={product.title}
                      width={48}
                      height={36}
                      className="size-11 shrink-0 rounded-md border border-border bg-background object-contain"
                    />
                    <p className="line-clamp-2 text-sm font-semibold text-foreground">
                      {product.title}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {usageDefs.map(({ row }) => {
                      const numericValue = row.getValue?.(product) ?? null;
                      const textValue = row.getText?.(product) ?? null;
                      const content = row.render
                        ? row.render(product)
                        : (textValue ?? formatValue(numericValue));
                      return (
                        <div
                          key={`${product.id}-${row.id}`}
                          className="rounded-xl border border-border bg-background px-3 py-3"
                        >
                          <p className="mb-2 truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {row.label}
                          </p>
                          <div className="min-w-0">{content}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>{t("compare.performance")}</SectionTitle>
          <CompareTableBlock rows={summaryRows} products={pair} />
        </section>

        <section>
          <SectionTitle>{t("compare.sectionHardware")}</SectionTitle>
          <CompareTableBlock rows={hardwareRows} products={pair} />
        </section>

        <section>
          <SectionTitle>{t("compare.sectionDisplay")}</SectionTitle>
          <CompareTableBlock rows={displayRows} products={pair} />
        </section>

        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/10 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="max-w-xl text-sm text-muted-foreground">
            {t("productDetails.viewOnSource")}
          </p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:shrink-0">
            {pair.map((product) =>
              product.product_url ? (
                <a
                  key={product.id}
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("productDetails.viewOnSource")}: ${product.title}`}
                  className="inline-flex h-auto min-h-[44px] max-w-full flex-col items-center justify-center gap-0.5 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:max-w-[220px]"
                >
                  <span>{t("productDetails.viewOnSource")}</span>
                  <span className="line-clamp-1 w-full text-xs font-normal opacity-90">
                    {product.title}
                  </span>
                </a>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
