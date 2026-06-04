import { expect, test } from "vite-plus/test";
import { isExternalHref, isInlineCode, mapCodeLanguage, normalizeCodeValue } from "../src/index.ts";

test("mapCodeLanguage resolves known aliases and fallbacks", () => {
  expect(mapCodeLanguage(undefined)).toBe("markdown");
  expect(mapCodeLanguage("language-js")).toBe("javascript");
  expect(mapCodeLanguage("language-tsx")).toBe("javascript");
  expect(mapCodeLanguage("language-yml")).toBe("yaml");
  expect(mapCodeLanguage("language-html")).toBe("html");
  expect(mapCodeLanguage("language-unknown")).toBe("markdown");
});

test("isExternalHref detects external and protocol links", () => {
  expect(isExternalHref("https://example.com")).toBe(true);
  expect(isExternalHref("//cdn.example.com/a.js")).toBe(true);
  expect(isExternalHref("mailto:hello@example.com")).toBe(true);
  expect(isExternalHref("tel:+18005551234")).toBe(true);
  expect(isExternalHref("/docs/getting-started")).toBe(false);
  expect(isExternalHref("docs/getting-started")).toBe(false);
  expect(isExternalHref(undefined)).toBe(false);
});

test("normalizeCodeValue flattens and trims terminal newline", () => {
  expect(normalizeCodeValue("const a = 1;\n")).toBe("const a = 1;");
  expect(normalizeCodeValue(["line1\n", "line2\n"])).toBe("line1\nline2");
  expect(normalizeCodeValue(null)).toBe("");
});

test("isInlineCode respects class hints and line breaks", () => {
  expect(isInlineCode("const a = 1", "language-js")).toBe(false);
  expect(isInlineCode("single line", undefined)).toBe(true);
  expect(isInlineCode("line1\nline2", undefined)).toBe(false);
  expect(isInlineCode(["part one", " and two"], undefined)).toBe(true);
  expect(isInlineCode(["part one\n", "and two"], undefined)).toBe(false);
});
