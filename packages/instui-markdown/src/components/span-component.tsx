import { Badge } from "@instructure/ui-badge/v11_7";
import { InlineSVG } from "@instructure/ui-svg-images";
import { Text } from "@instructure/ui-text/v11_7";
import * as InstUIIcons from "@instructure/ui-icons";
import type { InstUIIconProps } from "@instructure/ui-icons";
import type { ReactNode } from "react";
import { isLiteralColorValue, normalizeColorForSwatch } from "../helpers.tsx";
import type { SimpleIconTokenData } from "../types.ts";

interface SpanComponentOptions {
  showColorCodes: boolean;
  showIcons: boolean;
  iconColor?: string;
  enableInstuiIcons: boolean;
  enableSimpleIcons: boolean;
  simpleIconColor?: string;
  resolveSimpleIcon?: (code: string) => SimpleIconTokenData | undefined;
}

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function parseIconTokenName(iconName: string) {
  const withoutPrefix = iconName.startsWith("Icon") ? iconName.slice(4) : iconName;
  const isSolid = withoutPrefix.endsWith("Solid");
  const isInstUI = withoutPrefix.endsWith("InstUIIcon");
  let root = withoutPrefix;

  if (isSolid) {
    root = withoutPrefix.slice(0, -5);
  } else if (isInstUI) {
    root = withoutPrefix.slice(0, -10);
  } else if (withoutPrefix.endsWith("Line")) {
    root = withoutPrefix.slice(0, -4);
  }

  return {
    withoutPrefix,
    isSolid,
    isInstUI,
    root,
  };
}

function getSimpleIconCodes(iconName: string, root: string, withoutPrefix: string): string[] {
  const camel = root.charAt(0).toLowerCase() + root.slice(1);
  const lower = root.toLowerCase();

  return Array.from(new Set([iconName, withoutPrefix, root, camel, lower]));
}

export function createSpanComponent(options: SpanComponentOptions) {
  return ({
    children,
    className,
    ...props
  }: {
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => {
    if (className?.includes("icon-token") && options.showIcons) {
      const iconName = (props as Record<string, unknown>)["data-icon"] as string | undefined;
      const inlineIconColor = (props as Record<string, unknown>)["data-icon-color"] as
        | string
        | undefined;
      if (iconName) {
        const { withoutPrefix, isSolid, isInstUI, root } = parseIconTokenName(iconName);

        if (options.enableInstuiIcons) {
          const normalizedRoot = toPascalCase(root);
          const candidates = isSolid
            ? [`Icon${normalizedRoot}Solid`]
            : isInstUI
              ? [`${normalizedRoot}InstUIIcon`]
              : [
                  `${normalizedRoot}InstUIIcon`,
                  `Icon${normalizedRoot}Line`,
                  `Icon${normalizedRoot}`,
                ];

          const IconComponent = candidates
            .map((name) => (InstUIIcons as Record<string, unknown>)[name])
            .find(Boolean) as React.ComponentType<InstUIIconProps> | undefined;

          if (IconComponent) {
            const resolvedColor = inlineIconColor ?? options.iconColor;
            const normalizedIconColor =
              resolvedColor && isLiteralColorValue(resolvedColor)
                ? normalizeColorForSwatch(resolvedColor)
                : undefined;

            // wrapCustomIcon-based components (displayName "InstUIIcon_*") have no
            // default size and collapse to zero dimensions without an explicit size prop.
            // SVGIcon-based components default to 1em×1em so they don't need this.
            const isCustomIcon = (
              IconComponent as { displayName?: string }
            ).displayName?.startsWith("InstUIIcon_");
            const sizeProps = isCustomIcon
              ? ({ size: "x-small" } as Pick<InstUIIconProps, "size">)
              : {};

            if (normalizedIconColor) {
              return (
                <span style={{ color: normalizedIconColor }}>
                  <IconComponent title={iconName} color="inherit" {...sizeProps} />
                </span>
              );
            }

            const iconTokenColor = resolvedColor === "currentColor" ? "inherit" : resolvedColor;

            return (
              <IconComponent
                title={iconName}
                color={(iconTokenColor ?? "inherit") as InstUIIconProps["color"]}
                {...sizeProps}
              />
            );
          }
        }

        if (options.enableSimpleIcons && options.resolveSimpleIcon) {
          const candidateCodes = getSimpleIconCodes(iconName, root, withoutPrefix);
          const simpleIcon = candidateCodes
            .map((code) => options.resolveSimpleIcon?.(code))
            .find(Boolean) as SimpleIconTokenData | undefined;

          if (simpleIcon?.path) {
            const resolvedColor = inlineIconColor ?? options.simpleIconColor ?? options.iconColor;
            const normalizedIconColor =
              resolvedColor && isLiteralColorValue(resolvedColor)
                ? normalizeColorForSwatch(resolvedColor)
                : undefined;

            const label = simpleIcon.title ?? root;

            return (
              <span style={normalizedIconColor ? { color: normalizedIconColor } : undefined}>
                <InlineSVG
                  inline={false}
                  viewBox={simpleIcon.viewBox ?? "0 0 24 24"}
                  width={simpleIcon.width ?? "1em"}
                  height={simpleIcon.height ?? "1em"}
                  role="img"
                  aria-label={label}
                >
                  <title>{label}</title>
                  <path d={simpleIcon.path} fill="currentColor" />
                </InlineSVG>
              </span>
            );
          }
        }
      }
    }

    if (className?.includes("color-code") && options.showColorCodes) {
      const colorValue = (props as Record<string, unknown>)["data-color"] as string | undefined;
      if (colorValue) {
        const normalizedColor = normalizeColorForSwatch(colorValue);
        if (normalizedColor) {
          return (
            <>
              {children}{" "}
              <Badge
                type="notification"
                variant="primary"
                placement="start"
                pulse={false}
                themeOverride={{ colorPrimary: normalizedColor }}
                standalone
                margin="none none xxx-small"
              />
            </>
          );
        }
      }
    }

    return <Text as="span">{children}</Text>;
  };
}
