import { Link } from "@instructure/ui-link/v11_7";
import { ExternalLinkInstUIIcon, LinkInstUIIcon } from "@instructure/ui-icons";
import type { ReactNode } from "react";
import { isExternalHref } from "../helpers.tsx";

interface LinkComponentOptions {
  showExternalIcon: boolean;
  showPermalinks: boolean;
  permalinkClassName: string;
}

export function createLinkComponent(options: LinkComponentOptions) {
  return ({
    children,
    href,
    title,
    className,
    ...props
  }: {
    children?: ReactNode;
    href?: string;
    title?: string;
    className?: string;
    [key: string]: unknown;
  }) => {
    const ariaLabel =
      typeof (props as Record<string, unknown>)["aria-label"] === "string"
        ? ((props as Record<string, unknown>)["aria-label"] as string)
        : undefined;

    if (className?.includes("mdx-heading-anchor") || ariaLabel === "Permalink") {
      if (!options.showPermalinks) {
        return null;
      }
      return (
        <>
          {" "}
          <Link
            href={href}
            title={title}
            aria-label={ariaLabel ?? title ?? "Permalink"}
            className={options.permalinkClassName}
          >
            <LinkInstUIIcon size="x-small" />
          </Link>
        </>
      );
    }

    if (isExternalHref(href)) {
      return (
        <Link href={href} title={title} target="_blank" rel="noopener noreferrer">
          {children}{" "}
          {options.showExternalIcon && <ExternalLinkInstUIIcon size="x-small" aria-hidden="true" />}
        </Link>
      );
    }

    return (
      <Link href={href} title={title}>
        {children}
      </Link>
    );
  };
}
