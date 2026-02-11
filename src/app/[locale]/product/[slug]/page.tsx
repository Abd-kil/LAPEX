import { notFound } from "next/navigation";
import { ProductDetailsContent } from "@/app/components/sections/product/ProductDetailsContent";
import { Locale } from "@/app/lib/i18n/locales";
import { getLaptopWithDetails } from "@/app/lib/supabase/queries";
import { LaptopWithDetails } from "@/app/lib/constants/models";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string, locale: Locale}> })
{
  const { slug, locale } = await params;
  
  let laptop: LaptopWithDetails | null = null;
  
  // Try to parse slug as a number (database ID)
  const laptopId = parseInt(slug, 10);
  
  if (!isNaN(laptopId)) {
    try {
      laptop = await getLaptopWithDetails(laptopId);
    } catch (error) {
      console.error("Error fetching laptop by ID:", error);
      laptop = null;
    }
  }
  
  // Fallback to finding by slug string
  const product = laptop;
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetailsContent product={product} />;
}

