"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/app/components/sections/ProductCard";
import { getLaptops, getCategories } from "@/app/lib/supabase/queries";
import type { Laptop, Category } from "@/app/lib/constants/models";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { HOME_BRANDS } from "@/app/lib/constants/mockCategories";
import { buildSearchParams, parseSearchFilters } from "@/app/lib/search/filters";
import LoadingLogo from "../../ui/LoadingLogo";

export function SearchContent() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const PRICE_MIN = 0;
  const PRICE_MAX = 10000;
  const PRICE_STEP = 50;

  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams]);
  const searchQuery = filters.q;
  const brand = filters.brand;
  const categoryId = filters.categoryId;
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;

  // Filter states (draft values)
  const [selectedBrand, setSelectedBrand] = useState(brand || "");
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [priceMin, setPriceMin] = useState(minPrice || "");
  const [priceMax, setPriceMax] = useState(maxPrice || "");
  const sliderMin = Math.max(
    PRICE_MIN,
    Math.min(PRICE_MAX, parseInt(priceMin || `${PRICE_MIN}`, 10))
  );
  const sliderMax = Math.max(
    PRICE_MIN,
    Math.min(PRICE_MAX, parseInt(priceMax || `${PRICE_MAX}`, 10))
  );

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedBrand(brand || "");
    setSelectedCategory(categoryId || "");
    setPriceMin(minPrice || "");
    setPriceMax(maxPrice || "");
  }, [brand, categoryId, minPrice, maxPrice]);

  useEffect(() => {
    async function fetchLaptops() {
      try {
        setLoading(true);
        setError(null);

        const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
        const parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
        const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

        const data = await getLaptops({
          isAvailable: true,
          searchQuery,
          brand,
          categoryId: Number.isNaN(parsedCategoryId) ? undefined : parsedCategoryId,
          minPrice: Number.isNaN(parsedMinPrice) ? undefined : parsedMinPrice,
          maxPrice: Number.isNaN(parsedMaxPrice) ? undefined : parsedMaxPrice,
        });

        setLaptops(data);
      } catch (err) {
        console.error("Error fetching laptops:", err);
        setError("Failed to load laptops");
      } finally {
        setLoading(false);
      }
    }

    fetchLaptops();
  }, [searchQuery, brand, categoryId, minPrice, maxPrice]);

  const appliedParamsString = useMemo(() => {
    return buildSearchParams({
      q: searchQuery,
      brand,
      categoryId,
      minPrice,
      maxPrice,
    }).toString();
  }, [searchQuery, brand, categoryId, minPrice, maxPrice]);

  // Auto-apply discrete filters (brand/category) with debounce.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = buildSearchParams({
        q: searchQuery,
        brand: selectedBrand || undefined,
        categoryId: selectedCategory || undefined,
        // Keep applied price values until user clicks Apply.
        minPrice,
        maxPrice,
      });
      const next = params.toString();
      if (next !== appliedParamsString) {
        router.replace(`/${locale}/search${next ? `?${next}` : ""}`);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    appliedParamsString,
    locale,
    maxPrice,
    minPrice,
    router,
    searchQuery,
    selectedBrand,
    selectedCategory,
  ]);

  // Apply filters (includes price inputs)
  const applyFilters = () => {
    const params = buildSearchParams({
      q: searchQuery,
      brand: selectedBrand || undefined,
      categoryId: selectedCategory || undefined,
      minPrice: priceMin || undefined,
      maxPrice: priceMax || undefined,
    });
    const qs = params.toString();
    router.push(`/${locale}/search${qs ? `?${qs}` : ""}`);
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    setPriceMin("");
    setPriceMax("");
    const params = buildSearchParams({ q: searchQuery });
    const qs = params.toString();
    router.push(`/${locale}/search${qs ? `?${qs}` : ""}`);
  };

  // Build title based on search parameters
  const getTitle = () => {
    if (searchQuery) return t("search.searchResults", { query: searchQuery });
    if (brand) return t("search.brandLaptops", { brand });
    if (categoryId) return t("search.categoryResults");
    return t("search.title");
  };

  const hasActiveFilters = selectedBrand || selectedCategory || priceMin || priceMax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="mb-6 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {getTitle()}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {loading
                  ? t("search.loading")
                  : t("search.laptopsFound", { count: laptops.length })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/50 sm:hidden"
              aria-expanded={showFilters}
            >
              {t("search.filters")}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Filters Section */}
          <div
            className={[
              "rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur",
              showFilters ? "block" : "hidden",
              "sm:block",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {t("search.filters")}
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {t("search.clearFilters")}
                </button>
              )}
            </div>

            <div className="mt-5 space-y-5">
              {/* Brand Filter */}
              <div>
                <label htmlFor="brand-filter" className="block text-sm font-medium text-foreground mb-2">
                  {t("search.brand")}
                </label>
                <select
                  id="brand-filter"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
                >
                  <option value="">{t("search.allBrands")}</option>
                  {HOME_BRANDS.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-foreground mb-2">
                  {t("search.category")}
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
                >
                  <option value="">{t("search.allCategories")}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    {t("search.maxPrice")}
                  </label>
                  <span className="text-xs font-semibold text-foreground">
                    {sliderMin} - {sliderMax}
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={Math.min(sliderMin, sliderMax)}
                    onChange={(e) => {
                      const next = Math.min(parseInt(e.target.value, 10), sliderMax);
                      setPriceMin(String(next));
                    }}
                    onMouseUp={applyFilters}
                    onTouchEnd={applyFilters}
                    className="w-full accent-primary"
                  />
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={Math.max(sliderMin, sliderMax)}
                    onChange={(e) => {
                      const next = Math.max(parseInt(e.target.value, 10), sliderMin);
                      setPriceMax(String(next));
                    }}
                    onMouseUp={applyFilters}
                    onTouchEnd={applyFilters}
                    className="w-full accent-primary"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{PRICE_MIN}</span>
                    <span>{PRICE_MAX}</span>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-3">
                <button
                  onClick={applyFilters}
                  className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  {t("search.applyFilters")}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/50"
                  >
                    {t("search.clearFilters")}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            {error && (
              <div className="mb-6 rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                {t("search.error")}
              </div>
            )}

            {!loading && laptops.length === 0 && (
              <div className="rounded-2xl border border-border bg-muted/20 p-12 text-center">
                <p className="text-lg text-muted-foreground">
                  {t("search.noResults")}
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full w-full flex items-center justify-center">
                <LoadingLogo/>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {!loading && laptops.map((laptop) => (
                <ProductCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
