"use client";

import React from "react";
import type { LaptopWithDetails } from "@/app/lib/constants/models";
import type { CompareRow } from "./utils";
import { formatValue, getWinners } from "./utils";

export default function CompareTableBlock({
  rows,
  products,
}: {
  rows: CompareRow[];
  products: LaptopWithDetails[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      {rows.map((row, ri) => {
        const winners = getWinners(products, row);
        const isLast = ri === rows.length - 1;
        return (
          <div
            key={row.id}
            className={["transition-colors hover:bg-muted/30", !isLast ? "border-b border-border" : ""].join(" ")}
          >
            <div className="flex flex-col md:grid md:grid-cols-12">
              <div className={["bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground", "md:col-span-4 md:border-border md:border-e"].join(" ")}>{row.label}</div>
              <div className="grid grid-cols-2 bg-border md:contents">
                {products.map((product, index) => {
                  const numericValue = row.getValue?.(product) ?? null;
                  const textValue = row.getText?.(product) ?? null;
                  const content = row.render ? row.render(product) : (textValue ?? formatValue(numericValue));
                  const highlight = winners.has(index);
                  const borderClass = index === 0 ? "md:border-e md:border-border" : "";
                  return (
                    <div
                      key={`${row.id}-${product.id}`}
                      className={["min-w-0 bg-background px-4 py-3 text-sm text-foreground", "sm:text-start", "md:col-span-4", borderClass, highlight ? "ring-1 ring-inset ring-primary/30 bg-primary/10" : ""].join(" ")}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</h2>
  );
}
