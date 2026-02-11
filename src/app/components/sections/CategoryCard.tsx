"use client";

import Image from "next/image";
import type { Category } from "@/app/lib/constants/models";
import { CSSProperties } from "react";

export function CategoryCard({
  category,
  image_src,
  style,
  imageClassName,
}: {
  category: Category;
  image_src: string;
  style?: CSSProperties;
  imageClassName?: string;
}) {

  return (
    <div className="w-[160px] shrink-0 rounded-2xl border border-border bg-background p-5 text-center transition hover:bg-muted/20 sm:w-[180px] cursor-pointer">
      <div className="flex items-center justify-center">
        <Image
          src={image_src}
          alt={category.name}
          width={80}
          height={80}
          className={`h-16 w-16 object-contain ${imageClassName ?? ""}`}
          style={style}
        />
      </div>
      <h4 className="mt-4 text-sm font-medium text-foreground capitalize">{category.name}</h4>
    </div>
  );
}

