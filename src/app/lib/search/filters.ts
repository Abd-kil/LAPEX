export const SEARCH_FILTER_KEYS = [
  "q",
  "brand",
  "categoryId",
  "minPrice",
  "maxPrice",
] as const;

export type SearchFilterKey = (typeof SEARCH_FILTER_KEYS)[number];

export type SearchFilters = Partial<Record<SearchFilterKey, string>>;

function normalizeValue(value: string | null): string | undefined {
  if (value === null) return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

type SearchParamsLike = Pick<URLSearchParams, "get">;

export function parseSearchFilters(params: SearchParamsLike): SearchFilters {
  const filters: SearchFilters = {};
  for (const key of SEARCH_FILTER_KEYS) {
    const value = normalizeValue(params.get(key));
    if (value !== undefined) {
      filters[key] = value;
    }
  }
  return filters;
}

export function buildSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of SEARCH_FILTER_KEYS) {
    const value = filters[key];
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }
  return params;
}

export function hasFilters(filters: SearchFilters, includeQuery: boolean = true): boolean {
  const keys = includeQuery ? SEARCH_FILTER_KEYS : SEARCH_FILTER_KEYS.filter((k) => k !== "q");
  return keys.some((key) => {
    const value = filters[key];
    return value !== undefined && value !== "";
  });
}
