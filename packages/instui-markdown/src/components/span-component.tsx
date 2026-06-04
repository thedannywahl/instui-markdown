import { Badge } from "@instructure/ui-badge/v11_7";
import { Text } from "@instructure/ui-text/v11_7";
import * as InstUIIcons from "@instructure/ui-icons";
import type { InstUIIconProps } from "@instructure/ui-icons";
import type { ReactNode } from "react";
import { isLiteralColorValue, normalizeColorForSwatch } from "../helpers.tsx";

interface SpanComponentOptions {
  showColorCodes: boolean;
  showIcons: boolean;
  iconColor?: string;
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

        const candidates = isSolid
          ? [`Icon${root}Solid`]
          : isInstUI
            ? [`${root}InstUIIcon`]
            : [`${root}InstUIIcon`, `Icon${root}Line`, `Icon${root}`];

        const IconComponent = candidates
          .map((name) => (InstUIIcons as Record<string, unknown>)[name])
          .find(Boolean) as React.ComponentType<InstUIIconProps> | undefined;

        if (IconComponent) {
          const resolvedColor = inlineIconColor ?? options.iconColor;
          const normalizedIconColor =
            resolvedColor && isLiteralColorValue(resolvedColor)
              ? normalizeColorForSwatch(resolvedColor)
              : undefined;

          if (normalizedIconColor) {
            return (
              <span style={{ color: normalizedIconColor }}>
                <IconComponent title={iconName} color="inherit" />
              </span>
            );
          }

          const iconTokenColor = resolvedColor === "currentColor" ? "inherit" : resolvedColor;

          return (
            <IconComponent
              title={iconName}
              color={(iconTokenColor ?? "inherit") as InstUIIconProps["color"]}
            />
          );
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
