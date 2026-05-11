import { LaptopWithDetails } from "@/app/lib/constants/models";
import Link from "next/link";
import { useI18n } from "../i18n/I18nProvider";
import Image from "next/image";

const ProductCompareCard = ({
  product,
  imageURL,
}: {
  product: LaptopWithDetails;
  imageURL: string;
}) => {
  const { t, locale } = useI18n();
  return (
    <div className="sm:flex gap-2 justify-between rounded-xl border border-border bg-muted/10 overflow-hidden p-2 sm:p-4">
      <div className="flex-1 flex items-center justify-center">
        <Image
          src={imageURL}
          alt={product.title}
          width={200}
          height={160}
          className="h-28 w-auto object-contain"
        />
      </div>
      <div className="flex-1 mt-3 space-y-1 text-center">
        <p className="text-sm font-semibold text-foreground">{product.title}</p>
        {/* <p className="text-xs text-muted-foreground">
          {product.brand} {product.model && `- ${product.model}`}
        </p> */}
        {product.price != null && (
          <p className="text-sm font-semibold text-foreground">
            {product.currency === "USD" && "$"}
            {product.price.toLocaleString()}{" "}
            {product.currency !== "USD" && product.currency}
          </p>
        )}
        {/* </div>
      <div className="mt-4 flex justify-center"> */}
        {/* <Link
          href={`/${locale}/product/${product.id}`}
          className="inline-flex items-center justify-center rounded-full border border-primary py-1 px-5 text-xs font-semibold text-primary transition hover:bg-primary/5"
        >
          {t("common.viewAll")}
        </Link> */}
      </div>
    </div>
  );
};
export default ProductCompareCard;
