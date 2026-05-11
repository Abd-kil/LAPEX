import { CompareContent } from "@/app/components/sections/compare/CompareContent";
import { getLaptopWithDetails } from "@/app/lib/supabase/queries";
import type { LaptopWithDetails } from "@/app/lib/constants/models";

const MAX_COMPARE = 2;

export default async function ComparePage({
  searchParams,
}: {
  searchParams?: Promise<{ ids?: string }>;
}) {
  const resolvedSearchParams = searchParams
    ? await searchParams
    : undefined;
  const idsParam = resolvedSearchParams?.ids ?? "";
  const ids = Array.from(
    new Set(
      idsParam
        .split(",")
        .map((value) => parseInt(value.trim(), 10))
        .filter((value) => !Number.isNaN(value)),
    ),
  ).slice(0, MAX_COMPARE);

  let products: LaptopWithDetails[] = [];

  if (ids.length) {
    try {
      const results = await Promise.all(
        ids.map(async (id) => getLaptopWithDetails(id)),
      );
      products = results.filter(Boolean) as LaptopWithDetails[];
    } catch (error) {
      console.error("Error fetching compare laptops:", error);
      products = [];
    }
  }

  return <CompareContent products={products} />;
}
