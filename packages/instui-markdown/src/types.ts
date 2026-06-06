import type { ReactNode } from "react";

/**
 * Visual and behavioral options for markdown renderers created by this package.
 */
export interface InstuiMarkdownRenderOptions {
  /** Options for alert-styled blockquotes. */
  alert?: {
    /** Enables a close button for admonition alerts. */
    closeButton?: boolean;
  };
  /** Options for markdown table rendering. */
  table?: {
    /** Table display mode supported by InstUI table layout. */
    display?: "auto" | "stacked" | "fixed";
    /** Enables hover row highlighting. */
    hover?: boolean;
    /** Enables sortable headers and row sorting. */
    sortable?: boolean;
  };
  /** Options for markdown link rendering. */
  link?: {
    /** Shows an external-link icon for external URLs. */
    externalIcon?: boolean;
    /** Enables heading permalink anchors. */
    permalinks?: boolean;
    /** CSS class used for heading permalink anchor links. */
    permalinkClassName?: string;
  };
  /** Options for fenced code block rendering. */
  code?: {
    /** Enables editing for code blocks. */
    editable?: boolean;
    /** Marks code blocks as read-only. */
    readOnly?: boolean;
    /** Shows line numbers in code blocks. */
    lineNumbers?: boolean;
    /** Enables soft wrapping of long lines. */
    lineWrapping?: boolean;
    /** Enables spell check in editable blocks. */
    spellCheck?: boolean;
    /** Highlights the active line in code blocks. */
    highlightActiveLine?: boolean;
    /** Text direction used by the code editor. */
    direction?: "ltr" | "rtl";
  };
  /** Options for color token rendering. */
  color?: {
    /** Enables color swatches for detected color tokens. */
    enabled?: boolean;
  };
  /** Options for icon token rendering. */
  icons?: {
    /** Enables :icon: token rendering. */
    enabled?: boolean;
    /** Default icon color for rendered icon tokens. */
    color?: string;
    /** Per-provider icon source controls. */
    providers?: {
      /** Enables lookup against @instructure/ui-icons. */
      instui?: boolean;
      /** Enables fallback lookup against configured simple icon resolver. */
      simpleIcons?: boolean;
    };
    /** Options for resolving non-InstUI icon codes to inline SVG output. */
    simpleIcons?: {
      /** Default color for simple icon output. Falls back to icons.color. */
      color?: string;
      /**
       * Resolves a token code into SVG path data rendered by InlineSVG.
       * Return undefined when no match exists.
       */
      resolve?: (code: string) => SimpleIconTokenData | undefined;
    };
  };
}

/**
 * Minimal shape needed to render a simple icon with InlineSVG.
 */
export interface SimpleIconTokenData {
  /** SVG path data for the icon. */
  path: string;
  /** Optional human-friendly icon title used for accessibility. */
  title?: string;
  /** Optional SVG viewBox. Defaults to "0 0 24 24". */
  viewBox?: string;
  /** Optional explicit width. Defaults to 1em. */
  width?: string | number;
  /** Optional explicit height. Defaults to 1em. */
  height?: string | number;
}

/**
 * Props accepted by the InstUI markdown renderer component.
 */
export interface InstuiMarkdownProps {
  /** Markdown text to render. */
  children: string;
  /** Optional renderer overrides. */
  renderOptions?: InstuiMarkdownRenderOptions;
}

/**
 * SourceCodeEditor languages supported by this renderer.
 */
export type EditorLanguage = "json" | "yaml" | "markdown" | "css" | "html" | "javascript";

/**
 * Supported admonition markers for blockquotes.
 */
export type AlertMarker = "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION";

/**
 * Sort direction for sortable markdown tables.
 */
export type TableSortDirection = "ascending" | "descending";

/**
 * Shared sortable-table context value.
 */
export interface TableSortContextValue {
  /** Registers a stable header index for sorting. */
  registerHeader: (headerId: string) => number;
  /** Active sort column index. */
  sortBy: number | null;
  /** Active sort direction. */
  sortDirection: TableSortDirection;
  /** Requests sorting by the supplied column index. */
  requestSort: (index: number) => void;
}

/**
 * Result of alert marker detection and prefix stripping.
 */
export interface AlertStripResult {
  /** Whether an alert marker was found. */
  found: boolean;
  /** Resolved marker when one was found. */
  marker?: AlertMarker;
  /** Node with alert marker text removed. */
  node: ReactNode;
}
