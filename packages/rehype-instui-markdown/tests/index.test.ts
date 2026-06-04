import { expect, test } from "vite-plus/test";
import {
  rehypeColorCodes,
  rehypeInstUIIconTokens,
  rehypeUnwrapBlockquoteParagraphs,
  type HastNode,
} from "../src/index.ts";

test("rehypeUnwrapBlockquoteParagraphs unwraps p children in blockquotes", () => {
  const tree: HastNode = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "blockquote",
        children: [
          {
            type: "element",
            tagName: "p",
            children: [{ type: "text", value: "Hello" }],
          },
          { type: "element", tagName: "strong", children: [{ type: "text", value: "World" }] },
        ],
      },
    ],
  };

  rehypeUnwrapBlockquoteParagraphs()(tree);

  const blockquote = (tree.children as HastNode[])[0] as HastNode;
  expect((blockquote.children as HastNode[]).length).toBe(2);
  expect((blockquote.children as HastNode[])[0]).toEqual({ type: "text", value: "Hello" });
});

test("rehypeColorCodes wraps color tokens outside code and pre blocks", () => {
  const tree: HastNode = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "p",
        children: [{ type: "text", value: "Use #fff and rgba(1, 2, 3, 0.4)." }],
      },
      { type: "element", tagName: "code", children: [{ type: "text", value: "#fff" }] },
    ],
  };

  rehypeColorCodes()(tree);

  const paragraphChildren = ((tree.children as HastNode[])[0] as HastNode).children as HastNode[];
  expect(
    paragraphChildren.some((child) => (child as { tagName?: string }).tagName === "span"),
  ).toBe(true);

  const wrapped = paragraphChildren.find(
    (child) => (child as { tagName?: string }).tagName === "span",
  ) as {
    properties?: Record<string, unknown>;
  };
  expect(wrapped.properties?.["data-color"]).toBe("#fff");

  const codeChildren = ((tree.children as HastNode[])[1] as HastNode).children as HastNode[];
  expect(codeChildren).toEqual([{ type: "text", value: "#fff" }]);
});

test("rehypeInstUIIconTokens wraps icon tokens and captures optional color", () => {
  const tree: HastNode = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "p",
        children: [{ type: "text", value: "Press :Search: or :Warning| #ff0000 :." }],
      },
      { type: "element", tagName: "pre", children: [{ type: "text", value: ":Search:" }] },
    ],
  };

  rehypeInstUIIconTokens()(tree);

  const paragraphChildren = ((tree.children as HastNode[])[0] as HastNode).children as HastNode[];
  const iconSpans = paragraphChildren.filter(
    (child) => (child as { tagName?: string }).tagName === "span",
  ) as Array<{ properties?: Record<string, unknown> }>;

  expect(iconSpans.length).toBe(2);
  expect(iconSpans[0].properties?.["data-icon"]).toBe("Search");
  expect(iconSpans[1].properties?.["data-icon"]).toBe("Warning");
  expect(iconSpans[1].properties?.["data-icon-color"]).toBe("#ff0000");

  const preChildren = ((tree.children as HastNode[])[1] as HastNode).children as HastNode[];
  expect(preChildren).toEqual([{ type: "text", value: ":Search:" }]);
});
