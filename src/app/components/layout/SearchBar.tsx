"use client";

import { useI18n } from "@/app/components/i18n/I18nProvider";
import { IconSearch, IconX } from "@/app/components/ui/Icon";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { searchLaptops } from "@/app/lib/supabase/queries";
import type { Laptop } from "@/app/lib/constants/models";
import Link from "next/link";
import Image from "next/image";
import { productDetailsHref, withLocale } from "@/app/lib/i18n/routing";
import {
  buildSearchParams,
  hasFilters,
  parseSearchFilters,
} from "@/app/lib/search/filters";

export function SearchBar({ isVisible }: { isVisible: boolean }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Laptop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const isSearchPage = pathname?.includes("/search");
  const preservedFilters = useMemo(
    () => parseSearchFilters(searchParams),
    [searchParams],
  );
  const allResultsHref = useMemo(() => {
    const params = buildSearchParams({
      ...preservedFilters,
      q: query.trim() || undefined,
    });
    const qs = params.toString();
    return withLocale(locale, `/search${qs ? `?${qs}` : ""}` as any);
  }, [locale, preservedFilters, query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search on input change
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (query.trim().length > 1 && !isSearchPage) {
        setIsLoading(true);
        try {
          const data = await searchLaptops(query.trim(), 5);
          setResults(data);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query, isSearchPage]);

  useEffect(() => {
    if (isSearchPage) {
      setQuery(preservedFilters.q || "");
      return;
    }
    setQuery("");
  }, [isSearchPage, preservedFilters.q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const nextFilters = {
      ...preservedFilters,
      q: trimmed.length ? trimmed : undefined,
    };

    if (!trimmed.length && !isSearchPage && !hasFilters(nextFilters, false)) {
      return;
    }

    setShowDropdown(false);
    const params = buildSearchParams(nextFilters);
    const qs = params.toString();
    router.push(`/${locale}/search${qs ? `?${qs}` : ""}`);
  };

  const handleClear = () => {
    setShowDropdown(false);
    setQuery("");
    const params = buildSearchParams({
      ...preservedFilters,
      q: undefined,
    });
    if (pathname?.includes("/search")) {
      const qs = params.toString();
      router.push(`/${locale}/search${qs ? `?${qs}` : ""}`);
    }
  };

  return (
    <div
      ref={searchRef}
      className={[
        "relative max-w-md transition-all",
        isVisible
          ? "w-full opacity-100"
          : "w-0 pointer-events-none opacity-0 sm:pointer-events-auto sm:w-full sm:opacity-100",
      ].join(" ")}
    >
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="search">
          {t("nav.searchPlaceholder")}
        </label>
        <input
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={()=>{
            if(query == "")
              handleClear();
          }}
          placeholder={t("nav.searchPlaceholder")}
          className="h-10 w-full rounded-full border border-border bg-muted/30 ps-4 pe-16 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-ring/40 transition focus:border-primary/50 focus:ring-2"
        />
        <div className="absolute end-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
              aria-label={t("search.clearSearch")}
            >
              <IconX className="h-4 w-4" />
            </button>
          )}
          <button type="submit" aria-label={t("nav.search")}>
            <IconSearch className="h-4 w-4 text-muted-foreground hover:text-foreground transition" />
          </button>
        </div>
      </form>

      {/* Dropdown Results */}
      {showDropdown && !isSearchPage && (
        <div className="absolute top-full mt-2 w-full rounded-2xl border border-border bg-background shadow-lg overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("search.searching")}...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="max-h-[400px] overflow-y-auto">
                {results.map((laptop) => (
                  <Link
                    key={laptop.id}
                    href={productDetailsHref(locale, laptop.id)}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 transition border-b border-border last:border-0"
                  >
                    <Image
                      src={laptop.image_url}
                      alt={laptop.title}
                      width={48}
                      height={48}
                      className="rounded-lg object-contain bg-muted/20"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {laptop.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {laptop.brand} •{" "}
                        {laptop.price
                          ? `${laptop.price} ${laptop.currency}`
                          : t("common.free")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href={allResultsHref}
                onClick={() => setShowDropdown(false)}
                className="block p-3 text-center text-sm font-medium text-primary hover:bg-muted/50 transition border-t border-border"
              >
                {t("search.viewAllResults")}
              </Link>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("search.noResults")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
