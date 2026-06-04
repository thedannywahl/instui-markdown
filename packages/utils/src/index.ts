/**
 * Languages supported by the markdown code editor integration.
 */
export type EditorLanguage = "json" | "yaml" | "markdown" | "css" | "html" | "javascript";

const EDITOR_LANGUAGES = new Set<EditorLanguage>([
  "json",
  "yaml",
  "markdown",
  "css",
  "html",
  "javascript",
]);

/**
 * Parses a markdown fence class name and maps it to an editor language.
 */
export function mapCodeLanguage(className?: string): EditorLanguage {
  const parsed = className?.match(/language-([\w-]+)/)?.[1]?.toLowerCase();
  if (!parsed) {
    return "markdown";
  }

  if (parsed === "js" || parsed === "jsx" || parsed === "ts" || parsed === "tsx") {
    return "javascript";
  }

  if (parsed === "yml") {
    return "yaml";
  }

  return EDITOR_LANGUAGES.has(parsed as EditorLanguage) ? (parsed as EditorLanguage) : "markdown";
}

/**
 * Returns true when an href points to an external target.
 */
export function isExternalHref(href?: string): boolean {
  if (!href) {
    return false;
  }

  return /^(https?:)?\/\//i.test(href) || /^(mailto|tel):/i.test(href);
}

/**
 * Normalizes raw code node content into a plain source string.
 */
export function normalizeCodeValue(content: string | readonly string[] | null | undefined): string {
  if (typeof content === "string") {
    return content.replace(/\n$/, "");
  }

  if (Array.isArray(content)) {
    return content.join("").replace(/\n$/, "");
  }

  return "";
}

/**
 * Returns true when markdown code should be treated as inline text.
 */
export function isInlineCode(
  content: string | readonly string[] | null | undefined,
  className?: string,
): boolean {
  if (className?.includes("language-")) {
    return false;
  }

  if (typeof content === "string") {
    return !content.includes("\n");
  }

  if (Array.isArray(content)) {
    return !content.some((item) => item.includes("\n"));
  }

  return true;
}
