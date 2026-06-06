import * as SimpleIcons from "simple-icons";
import type { SimpleIconTokenData } from "./types.ts";

export type SimpleIconResolver = (code: string) => SimpleIconTokenData | undefined;

export type SimpleIconsRegistry = Record<string, unknown>;

interface SimpleIconLike {
  slug?: string;
  title: string;
  path: string;
  viewBox?: string;
}

function isSimpleIconLike(value: unknown): value is SimpleIconLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "path" in value &&
    "title" in value &&
    typeof (value as { path?: unknown }).path === "string"
  );
}

function normalizeSimpleIconCode(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function toSimpleIconExportName(code: string): string {
  const words = code
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());

  const pascal = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
  return `si${pascal}`;
}

function buildSimpleIconLookup(
  iconsRegistry: SimpleIconsRegistry,
): Map<string, SimpleIconTokenData> {
  const lookup = new Map<string, SimpleIconTokenData>();

  for (const [exportName, iconCandidate] of Object.entries(iconsRegistry)) {
    if (!exportName.startsWith("si") || !isSimpleIconLike(iconCandidate)) {
      continue;
    }

    const slug = iconCandidate.slug ?? exportName.slice(2);
    lookup.set(normalizeSimpleIconCode(slug), {
      title: iconCandidate.title,
      path: iconCandidate.path,
      viewBox: iconCandidate.viewBox ?? "0 0 24 24",
    });
  }

  return lookup;
}

export function createSimpleIconsResolver(iconsRegistry: SimpleIconsRegistry): SimpleIconResolver {
  const lookup = buildSimpleIconLookup(iconsRegistry);

  return (code: string) => {
    const normalizedCode = normalizeSimpleIconCode(code);
    const normalizedWithoutPrefix = normalizedCode.startsWith("si")
      ? normalizedCode.slice(2)
      : normalizedCode;

    const bySlug =
      lookup.get(normalizedCode) ??
      (normalizedCode.startsWith("si") ? lookup.get(normalizedWithoutPrefix) : undefined);
    if (bySlug) {
      return bySlug;
    }

    const exportNameCandidates = [toSimpleIconExportName(code)];
    if (normalizedCode.startsWith("si")) {
      exportNameCandidates.push(toSimpleIconExportName(normalizedWithoutPrefix));
    }

    for (const exportName of exportNameCandidates) {
      const iconCandidate = iconsRegistry[exportName];
      if (isSimpleIconLike(iconCandidate)) {
        return {
          title: iconCandidate.title,
          path: iconCandidate.path,
          viewBox: iconCandidate.viewBox ?? "0 0 24 24",
        };
      }
    }

    return undefined;
  };
}

export const resolveSimpleIconToken: SimpleIconResolver = createSimpleIconsResolver(
  SimpleIcons as SimpleIconsRegistry,
);
