import { color2hex, colorToHex8, colorToRGB, isValid } from "@instructure/ui-color-utils";
import { InlineSVG } from "@instructure/ui-svg-images";
import { Children, cloneElement, createContext, isValidElement, type ReactNode } from "react";
import type {
  AlertMarker,
  AlertStripResult,
  EditorLanguage,
  TableSortContextValue,
} from "./types.ts";

const EDITOR_LANGUAGES = new Set<EditorLanguage>([
  "json",
  "yaml",
  "markdown",
  "css",
  "html",
  "javascript",
]);

/**
 * Mapping between admonition markers and InstUI alert variants.
 */
export const ALERT_VARIANTS: Record<AlertMarker, "info" | "success" | "warning" | "error"> = {
  NOTE: "info",
  TIP: "success",
  IMPORTANT: "warning",
  WARNING: "warning",
  CAUTION: "error",
};

const ALERT_PREFIX = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/;

/**
 * Shared sortable-table React context.
 */
export const TableSortContext = createContext<TableSortContextValue | null>(null);

/**
 * Maps markdown fenced-code language classes to editor language values.
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
 * Converts markdown code node children to normalized source text.
 */
export function normalizeCodeValue(content: ReactNode): string {
  if (typeof content === "string") {
    return content.replace(/\n$/, "");
  }
  if (Array.isArray(content)) {
    return content.join("").replace(/\n$/, "");
  }
  return "";
}

/**
 * Determines whether a code node should be treated as inline code.
 */
export function isInlineCode(children: ReactNode, className?: string): boolean {
  if (className?.includes("language-")) {
    return false;
  }

  if (typeof children === "string") {
    return !children.includes("\n");
  }

  if (Array.isArray(children)) {
    return !children.some((child) => typeof child === "string" && child.includes("\n"));
  }

  return true;
}

/**
 * Removes markdown admonition prefix text from a node tree.
 */
export function stripAlertPrefix(node: ReactNode): AlertStripResult {
  if (typeof node === "string") {
    const match = node.match(ALERT_PREFIX);
    if (!match) {
      return { found: false, node };
    }
    return {
      found: true,
      marker: match[1] as AlertMarker,
      node: node.replace(ALERT_PREFIX, ""),
    };
  }

  if (Array.isArray(node)) {
    const updatedChildren: ReactNode[] = [];
    let marker: AlertMarker | undefined;
    let found = false;

    for (const child of node) {
      if (found) {
        updatedChildren.push(child);
        continue;
      }
      const result = stripAlertPrefix(child);
      updatedChildren.push(result.node);
      if (result.found) {
        marker = result.marker;
        found = true;
      }
    }

    return found ? { found: true, marker, node: <>{updatedChildren}</> } : { found: false, node };
  }

  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return { found: false, node };
  }

  const originalChildren = Children.toArray(node.props.children);
  const updatedChildren: ReactNode[] = [];
  let marker: AlertMarker | undefined;
  let found = false;

  for (const child of originalChildren) {
    if (found) {
      updatedChildren.push(child);
      continue;
    }
    const result = stripAlertPrefix(child);
    updatedChildren.push(result.node);
    if (result.found) {
      marker = result.marker;
      found = true;
    }
  }

  if (!found) {
    return { found: false, node };
  }

  return {
    found: true,
    marker,
    node: cloneElement(node, undefined, updatedChildren),
  };
}

/**
 * Filters markdown children so only React element nodes remain.
 */
export function onlyElementChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).filter((child) => isValidElement(child));
}

/**
 * Returns true when an href points to an external destination.
 */
export function isExternalHref(href?: string): boolean {
  if (!href) {
    return false;
  }
  return /^(https?:)?\/\//i.test(href) || /^(mailto|tel):/i.test(href);
}

/**
 * Converts a valid CSS color value into normalized hex output for swatches.
 */
export function normalizeColorForSwatch(colorValue: string): string | undefined {
  if (!isValid(colorValue)) {
    return undefined;
  }

  const rgba = colorToRGB(colorValue);
  return rgba.a < 1 ? colorToHex8(colorValue) : color2hex(colorValue);
}

/**
 * Returns true when a color value is a literal color token form.
 */
export function isLiteralColorValue(colorValue: string): boolean {
  return /^(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\([^)]*\)|hsla?\([^)]*\))$/i.test(
    colorValue.trim(),
  );
}

/**
 * Recursively normalizes raw SVG nodes into InstUI InlineSVG wrappers.
 */
export function normalizeSvgElements(node: ReactNode): ReactNode {
  if (!isValidElement<Record<string, unknown>>(node)) {
    return node;
  }

  const childProps = node.props;
  const normalizedChildren = Children.map(childProps.children as ReactNode, (child) =>
    normalizeSvgElements(child),
  );

  if (node.type === "svg") {
    const className = typeof childProps.className === "string" ? childProps.className : undefined;
    const viewBox = typeof childProps.viewBox === "string" ? childProps.viewBox : undefined;
    const width =
      typeof childProps.width === "string" || typeof childProps.width === "number"
        ? childProps.width
        : undefined;
    const height =
      typeof childProps.height === "string" || typeof childProps.height === "number"
        ? childProps.height
        : undefined;
    const role = typeof childProps.role === "string" ? childProps.role : undefined;

    return (
      <InlineSVG
        inline={false}
        className={className}
        viewBox={viewBox}
        width={width}
        height={height}
        role={role}
      >
        {normalizedChildren}
      </InlineSVG>
    );
  }

  return cloneElement(node, undefined, normalizedChildren);
}

/**
 * Extracts plain text from arbitrary React node content.
 */
export function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map((child) => textFromNode(child)).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textFromNode(node.props.children);
  }
  return "";
}

/**
 * Compares table cell text with numeric-aware fallback string sorting.
 */
export function compareTableCellValues(a: string, b: string): number {
  const trimmedA = a.trim();
  const trimmedB = b.trim();
  const numA = Number(trimmedA);
  const numB = Number(trimmedB);
  const bothNumeric = Number.isFinite(numA) && Number.isFinite(numB);
  if (bothNumeric) {
    return numA - numB;
  }
  return trimmedA.localeCompare(trimmedB, undefined, { numeric: true, sensitivity: "base" });
}
