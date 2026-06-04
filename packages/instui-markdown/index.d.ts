import type { ReactNode } from "react";
import type { Components } from "react-markdown";

export interface InstuiMarkdownRenderOptions {
  alert?: {
    closeButton?: boolean;
  };
  table?: {
    display?: "auto" | "stacked" | "fixed";
    hover?: boolean;
    sortable?: boolean;
  };
  link?: {
    externalIcon?: boolean;
    permalinks?: boolean;
    permalinkClassName?: string;
  };
  code?: {
    editable?: boolean;
    readOnly?: boolean;
    lineNumbers?: boolean;
    lineWrapping?: boolean;
    spellCheck?: boolean;
    highlightActiveLine?: boolean;
    direction?: "ltr" | "rtl";
  };
  color?: {
    enabled?: boolean;
  };
  icons?: {
    enabled?: boolean;
    color?: string;
  };
}

export interface InstuiMarkdownProps {
  children: string;
  renderOptions?: InstuiMarkdownRenderOptions;
}

export interface InstuiMdxProviderProps {
  children: ReactNode;
  renderOptions?: InstuiMarkdownRenderOptions;
}

export declare const instuiMarkdownComponents: Components;

export declare function createInstuiMarkdownComponents(
  renderOptions?: InstuiMarkdownRenderOptions,
): Components;

export declare function InstuiMarkdown(props: InstuiMarkdownProps): ReactNode;

export declare function InstuiMdxProvider(props: InstuiMdxProviderProps): ReactNode;
