import type { Dictionary, TranslateParams } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getByPath(dict: Dictionary, key: string): unknown {
  const parts = key.split(".").filter(Boolean);
  let current: unknown = dict;

  for (const part of parts) {
    if (!isRecord(current)) return undefined;
    current = current[part];
  }

  return current;
}

function format(template: string, params?: TranslateParams): string {
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

export function createTranslator(dict: Dictionary) {
  return function t(key: string, params?: TranslateParams): string {
    const value = getByPath(dict, key);
    if (typeof value === "string") return format(value, params);
    if (typeof value === "number" || typeof value === "boolean") return format(String(value), params);
    return key;
  };
}

