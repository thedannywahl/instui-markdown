import { visit } from "unist-util-visit";

/**
 * Base shape shared by all nodes handled by these transforms.
 */
interface HastBaseNode {
  /** Unist node type. */
  type?: string;
  /** Optional HTML tag name. */
  tagName?: string;
  /** Optional text node value. */
  value?: string;
  /** Optional child nodes. */
  children?: HastNode[];
  /** Optional element properties. */
  properties?: Record<string, unknown>;
}

/**
 * Minimal text-node representation used by plugin transforms.
 */
export interface HastTextNode extends HastBaseNode {
  type: "text";
  value: string;
}

/**
 * Minimal element-node representation used by plugin transforms.
 */
export interface HastElementNode extends HastBaseNode {
  type: "element";
  tagName: string;
}

/**
 * Minimal root-node representation used by plugin transforms.
 */
export interface HastRootNode extends HastBaseNode {
  type: "root";
}

/**
 * Generic fallback node shape.
 */
export interface HastUnknownNode extends HastBaseNode {}

/**
 * Supported node variants handled by these plugins.
 */
export type HastNode = HastTextNode | HastElementNode | HastRootNode | HastUnknownNode;

/**
 * Signature for the tree transformer returned by each plugin factory.
 */
export type HastTransformer = (tree: HastNode) => void;

/**
 * Regex used to detect color tokens in markdown text nodes.
 */
export const COLOR_TOKEN_REGEX =
  /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)|hsla?\(\s*\d{1,3}(?:\.\d+)?\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)/gi;

/**
 * Regex used to detect icon tokens in markdown text nodes.
 */
export const ICON_TOKEN_REGEX = /:([a-zA-Z][a-zA-Z0-9]*)(?:\|([^:]+))?:/g;

function isElementNode(node: HastNode, tagName?: string): node is HastElementNode {
  return node.type === "element" && (tagName ? node.tagName === tagName : true);
}

function shouldSkipInlineTokenTransform(parent: HastNode): boolean {
  return isElementNode(parent, "pre") || isElementNode(parent, "code");
}

/**
 * Rehype plugin that unwraps bare paragraph nodes inside blockquotes.
 *
 * This avoids invalid nesting when markdown blockquote content later renders
 * through components that expect inline children.
 */
export function rehypeUnwrapBlockquoteParagraphs(): HastTransformer {
  return (tree) => {
    visit(tree as any, "element", (node: HastNode) => {
      if (!isElementNode(node, "blockquote")) {
        return undefined;
      }

      node.children = (node.children ?? []).flatMap((child) => {
        if (isElementNode(child, "p")) {
          return child.children ?? [];
        }
        return [child];
      });

      return undefined;
    });
  };
}

/**
 * Rehype plugin that wraps color tokens in a span with color metadata.
 *
 * It skips code and preformatted blocks to avoid mutating code examples.
 */
export function rehypeColorCodes(): HastTransformer {
  return (tree) => {
    visit(
      tree as any,
      "text",
      (node: HastNode, index: number | undefined, parent: HastNode | undefined) => {
        if (
          node.type !== "text" ||
          !parent ||
          index === undefined ||
          shouldSkipInlineTokenTransform(parent)
        ) {
          return undefined;
        }

        const value = node.value ?? "";
        const matches = [...value.matchAll(COLOR_TOKEN_REGEX)];
        if (matches.length === 0) {
          return undefined;
        }

        const nextChildren: HastNode[] = [];
        let lastIndex = 0;

        for (const match of matches) {
          const [matchText] = match;
          const start = match.index ?? 0;

          if (start > lastIndex) {
            nextChildren.push({ type: "text", value: value.slice(lastIndex, start) });
          }

          nextChildren.push({
            type: "element",
            tagName: "span",
            properties: {
              className: ["color-code"],
              "data-color": matchText,
            },
            children: [{ type: "text", value: matchText }],
          });

          lastIndex = start + matchText.length;
        }

        if (lastIndex < value.length) {
          nextChildren.push({ type: "text", value: value.slice(lastIndex) });
        }

        (parent.children ?? []).splice(index, 1, ...nextChildren);
        return index + nextChildren.length;
      },
    );
  };
}

/**
 * Rehype plugin that wraps :icon: and :icon|color: tokens in span metadata.
 *
 * It skips code and preformatted blocks to avoid mutating code examples.
 */
export function rehypeInstUIIconTokens(): HastTransformer {
  return (tree) => {
    visit(
      tree as any,
      "text",
      (node: HastNode, index: number | undefined, parent: HastNode | undefined) => {
        if (
          node.type !== "text" ||
          !parent ||
          index === undefined ||
          shouldSkipInlineTokenTransform(parent)
        ) {
          return undefined;
        }

        const value = node.value ?? "";
        const matches = [...value.matchAll(ICON_TOKEN_REGEX)];
        if (matches.length === 0) {
          return undefined;
        }

        const nextChildren: HastNode[] = [];
        let lastIndex = 0;

        for (const match of matches) {
          const [matchText, iconName, rawIconColor] = match;
          const iconColor = rawIconColor?.trim();
          const start = match.index ?? 0;

          if (start > lastIndex) {
            nextChildren.push({ type: "text", value: value.slice(lastIndex, start) });
          }

          const properties: Record<string, unknown> = {
            className: ["icon-token"],
            "data-icon": iconName,
          };

          if (iconColor) {
            properties["data-icon-color"] = iconColor;
          }

          nextChildren.push({
            type: "element",
            tagName: "span",
            properties,
            children: [{ type: "text", value: matchText }],
          });

          lastIndex = start + matchText.length;
        }

        if (lastIndex < value.length) {
          nextChildren.push({ type: "text", value: value.slice(lastIndex) });
        }

        (parent.children ?? []).splice(index, 1, ...nextChildren);
        return index + nextChildren.length;
      },
    );
  };
}
