import { expect, test } from "vite-plus/test";
import { InlineSVG } from "@instructure/ui-svg-images";
import { createSpanComponent } from "../src/components/span-component.tsx";
import {
  InstuiMarkdown,
  InstuiMdxProvider,
  createSimpleIconsResolver,
  createInstuiMarkdownComponents,
  instuiMarkdownComponents,
  resolveSimpleIconToken,
} from "../src/index.ts";
import {
  compareTableCellValues,
  isInlineCode,
  mapCodeLanguage,
  stripAlertPrefix,
  textFromNode,
} from "../src/helpers.tsx";

test("createInstuiMarkdownComponents exposes markdown handlers", () => {
  const components = createInstuiMarkdownComponents({
    table: { sortable: true },
    link: { externalIcon: true },
  });

  expect(typeof components.a).toBe("function");
  expect(typeof components.code).toBe("function");
  expect(typeof components.table).toBe("function");
});

test("default component map includes common renderers", () => {
  expect(typeof instuiMarkdownComponents.p).toBe("function");
  expect(typeof instuiMarkdownComponents.blockquote).toBe("function");
});

test("InstuiMarkdown and InstuiMdxProvider are callable components", () => {
  expect(typeof InstuiMarkdown).toBe("function");
  expect(typeof InstuiMdxProvider).toBe("function");
});

test("helpers map code language and detect inline code", () => {
  expect(mapCodeLanguage("language-tsx")).toBe("javascript");
  expect(mapCodeLanguage("language-yml")).toBe("yaml");
  expect(mapCodeLanguage("language-unknown")).toBe("markdown");

  expect(isInlineCode("let x = 1", undefined)).toBe(true);
  expect(isInlineCode("let x = 1\nlet y = 2", undefined)).toBe(false);
  expect(isInlineCode("x", "language-js")).toBe(false);
});

test("stripAlertPrefix strips markers from nested nodes", () => {
  const result = stripAlertPrefix("[!NOTE] Heads up");
  expect(result.found).toBe(true);
  expect(result.marker).toBe("NOTE");
  expect(result.node).toBe("Heads up");

  const untouched = stripAlertPrefix("Regular quote");
  expect(untouched.found).toBe(false);
});

test("table helper functions compare and normalize text", () => {
  expect(compareTableCellValues("2", "10")).toBeLessThan(0);
  expect(compareTableCellValues("beta", "Alpha")).toBeGreaterThan(0);
  expect(textFromNode(["A", 2, ["B"]])).toBe("A2B");
});

test("span icon renderer resolves simple icons through InlineSVG fallback", () => {
  const Span = createSpanComponent({
    showColorCodes: false,
    showIcons: true,
    iconColor: undefined,
    enableInstuiIcons: false,
    enableSimpleIcons: true,
    simpleIconColor: "#333",
    resolveSimpleIcon: (code) =>
      code.toLowerCase() === "github" ? { path: "M1 1h22v22H1z", title: "GitHub" } : undefined,
  });

  const rendered = Span({
    className: "icon-token",
    children: ":Github:",
    "data-icon": "Github",
  }) as { type: unknown; props: Record<string, unknown> };

  expect(rendered.type).toBe("span");
  const inlineSvg = rendered.props.children as { type: unknown; props: Record<string, unknown> };
  expect(inlineSvg.type).toBe(InlineSVG);
  expect(inlineSvg.props["aria-label"]).toBe("GitHub");
  expect(inlineSvg.props.inline).toBe(true);
});

test("span icon renderer leaves unknown token text unchanged", () => {
  const Span = createSpanComponent({
    showColorCodes: false,
    showIcons: true,
    iconColor: undefined,
    enableInstuiIcons: false,
    enableSimpleIcons: true,
    simpleIconColor: undefined,
    resolveSimpleIcon: () => undefined,
  });

  const rendered = Span({
    className: "icon-token",
    children: ":NotFound:",
    "data-icon": "NotFound",
  }) as { props: Record<string, unknown> };

  expect(rendered.props.children).toBe(":NotFound:");
});

test("span icon renderer does not call simple resolver when provider is disabled", () => {
  let calls = 0;
  const Span = createSpanComponent({
    showColorCodes: false,
    showIcons: true,
    iconColor: undefined,
    enableInstuiIcons: false,
    enableSimpleIcons: false,
    simpleIconColor: undefined,
    resolveSimpleIcon: () => {
      calls += 1;
      return { path: "M0 0", title: "Never" };
    },
  });

  const rendered = Span({
    className: "icon-token",
    children: ":Never:",
    "data-icon": "Never",
  }) as { props: Record<string, unknown> };

  expect(calls).toBe(0);
  expect(rendered.props.children).toBe(":Never:");
});

test("span icon renderer prefers token color over simple icon defaults", () => {
  const Span = createSpanComponent({
    showColorCodes: false,
    showIcons: true,
    iconColor: "#00ff00",
    enableInstuiIcons: false,
    enableSimpleIcons: true,
    simpleIconColor: "#0000ff",
    resolveSimpleIcon: () => ({ path: "M1 1h22v22H1z", title: "Color" }),
  });

  const rendered = Span({
    className: "icon-token",
    children: ":Color:",
    "data-icon": "Color",
    "data-icon-color": "#ff0000",
  }) as { props: Record<string, unknown> };

  const style = rendered.props.style as { color?: string } | undefined;
  expect(style?.color?.toLowerCase()).toContain("ff0000");
});

test("span icon renderer resolves InstUI icons case-insensitively", () => {
  const Span = createSpanComponent({
    showColorCodes: false,
    showIcons: true,
    iconColor: undefined,
    enableInstuiIcons: true,
    enableSimpleIcons: false,
    simpleIconColor: undefined,
  });

  const uppercaseResult = Span({
    className: "icon-token",
    children: ":Search:",
    "data-icon": "Search",
  });

  const lowercaseResult = Span({
    className: "icon-token",
    children: ":search:",
    "data-icon": "search",
  });

  expect(uppercaseResult.type).toBe(lowercaseResult.type);
});

test("span icon renderer resolves mixed-case InstUI names", () => {
  const Span = createSpanComponent({
    showColorCodes: false,
    showIcons: true,
    iconColor: undefined,
    enableInstuiIcons: true,
    enableSimpleIcons: false,
    simpleIconColor: undefined,
  });

  const explicitNameResult = Span({
    className: "icon-token",
    children: ":CreativeCommonsInstUIIcon:",
    "data-icon": "CreativeCommonsInstUIIcon",
  });

  const shorthandNameResult = Span({
    className: "icon-token",
    children: ":CreativeCommons:",
    "data-icon": "CreativeCommons",
  });

  expect(shorthandNameResult.type).toBe(explicitNameResult.type);
});

test("span simple icon resolver receives normalized slug candidates", () => {
  const seenCodes: string[] = [];
  const Span = createSpanComponent({
    showColorCodes: false,
    showIcons: true,
    iconColor: undefined,
    enableInstuiIcons: false,
    enableSimpleIcons: true,
    simpleIconColor: undefined,
    resolveSimpleIcon: (code) => {
      seenCodes.push(code);
      return code === "creative-commons"
        ? { path: "M1 1h22v22H1z", title: "Creative Commons" }
        : undefined;
    },
  });

  const rendered = Span({
    className: "icon-token",
    children: ":CreativeCommons:",
    "data-icon": "CreativeCommons",
  }) as { type: unknown };

  expect(rendered.type).toBe("span");
  expect(seenCodes).toContain("creative-commons");
});

test("createInstuiMarkdownComponents auto-registers simple-icons resolver", () => {
  const components = createInstuiMarkdownComponents({
    icons: {
      enabled: true,
      providers: {
        instui: false,
        simpleIcons: true,
      },
      simpleIcons: {},
    },
  });

  const span = components.span as (props: Record<string, unknown>) => {
    type: unknown;
    props: Record<string, unknown>;
  };

  const rendered = span({
    className: "icon-token",
    children: ":Claude:",
    "data-icon": "Claude",
  });

  expect(rendered.type).toBe("span");
  const inlineSvg = rendered.props.children as { type: unknown; props: Record<string, unknown> };
  expect(inlineSvg.type).toBe(InlineSVG);
  expect(inlineSvg.props["aria-label"]).toBe("Claude");
});

test("exported simple-icons resolver resolves plain and si-prefixed tokens", () => {
  const claude = resolveSimpleIconToken("Claude");
  const prefixed = resolveSimpleIconToken("siMcdonalds");

  expect(claude?.title).toBe("Claude");
  expect(prefixed?.title).toBe("McDonald's");

  const customResolver = createSimpleIconsResolver({
    siCustomIcon: {
      slug: "customicon",
      title: "Custom Icon",
      path: "M1 1h22v22H1z",
    },
  });

  expect(customResolver("custom-icon")?.title).toBe("Custom Icon");
});
