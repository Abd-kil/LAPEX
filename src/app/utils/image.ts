import { LaptopWithDetails } from "../lib/constants/models";

export function getProductImage(product: LaptopWithDetails) {
  if (product.images?.length) {
    const sorted = [...product.images].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    return sorted[0]?.image_url ?? product.image_url;
  }
  return product.image_url || "/images/vercel.svg";
}
