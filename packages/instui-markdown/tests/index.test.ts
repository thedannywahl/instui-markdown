import { expect, test } from "vite-plus/test";
import {
  InstuiMarkdown,
  InstuiMdxProvider,
  createInstuiMarkdownComponents,
  instuiMarkdownComponents,
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
