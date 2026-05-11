"use client";

import type { ReactNode } from "react";
import type { LaptopWithDetails } from "@/app/lib/constants/models";

export type CompareRow = {
  id: string;
  label: string;
  best?: "max" | "min";
  getValue?: (product: LaptopWithDetails) => number | null;
  getText?: (product: LaptopWithDetails) => string | null;
  render?: (product: LaptopWithDetails) => ReactNode;
};

export type UsageDef = { row: CompareRow };

export function formatValue(value: number | null, unit?: string) {
  if (value == null || Number.isNaN(value)) return "-";
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function getStorageTypeRank(value: string | null) {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  if (normalized === "NVME") return 3;
  if (normalized === "SSD") return 2;
  if (normalized === "HDD") return 1;
  return null;
}

export function getRamGenRank(value: string | null) {
  if (!value) return null;
  const match = value.match(/\d+/);
  if (!match) return null;
  const parsed = parseInt(match[0], 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getWinners(products: LaptopWithDetails[], row: CompareRow) {
  if (!row.best || !row.getValue) return new Set<number>();
  const values = products.map((product) => row.getValue?.(product));
  const numericValues = values.map((value) => (typeof value === "number" && !Number.isNaN(value) ? value : null));
  const available = numericValues.filter((value): value is number => value != null);
  if (available.length < 2) return new Set<number>();
  const bestValue = row.best === "min" ? Math.min(...available) : Math.max(...available);
  return new Set(numericValues.map((value, index) => (value === bestValue ? index : -1)).filter((index) => index >= 0));
}
