import { MDXProvider } from "@mdx-js/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  rehypeColorCodes,
  rehypeInstUIIconTokens,
  rehypeUnwrapBlockquoteParagraphs,
} from "rehype-instui-markdown";
import type { ReactNode } from "react";
import { createInstuiMarkdownComponents } from "./create-components.tsx";
import { normalizeSvgElements } from "./helpers.tsx";
import type { InstuiMarkdownProps, InstuiMarkdownRenderOptions } from "./types.ts";
export {
  createSimpleIconsResolver,
  resolveSimpleIconToken,
  type SimpleIconResolver,
  type SimpleIconsRegistry,
} from "./simple-icons-resolver.ts";

export type { InstuiMarkdownProps, InstuiMarkdownRenderOptions } from "./types.ts";
export { createInstuiMarkdownComponents, instuiMarkdownComponents } from "./create-components.tsx";

/**
 * Renders a markdown string with InstUI-backed element mappings.
 */
export function InstuiMarkdown({ children, renderOptions }: InstuiMarkdownProps) {
  const components = createInstuiMarkdownComponents(renderOptions);
  const showPermalinks = Boolean(renderOptions?.link?.permalinks);
  const permalinkClassName = renderOptions?.link?.permalinkClassName ?? "mdx-heading-anchor";

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        rehypeSlug,
        ...(showPermalinks
          ? [
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "append",
                  properties: { className: [permalinkClassName], "aria-label": "Permalink" },
                },
              ] as [typeof rehypeAutolinkHeadings, object],
            ]
          : []),
        rehypeUnwrapBlockquoteParagraphs,
        rehypeInstUIIconTokens,
        rehypeColorCodes,
      ]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}

/**
 * Provides InstUI markdown components to MDX content.
 */
export function InstuiMdxProvider({
  children,
  renderOptions,
}: {
  children: ReactNode;
  renderOptions?: InstuiMarkdownRenderOptions;
}) {
  const components = createInstuiMarkdownComponents(renderOptions);

  return <MDXProvider components={components}>{normalizeSvgElements(children)}</MDXProvider>;
}
