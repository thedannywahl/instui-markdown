import type { Components } from "react-markdown";
import type { InstuiMarkdownRenderOptions } from "./types.ts";
import {
  createPComponent,
  createEmComponent,
  createStrongComponent,
  createDelComponent,
  createInsComponent,
  createSubComponent,
  createSupComponent,
} from "./components/text-components.tsx";
import { createLinkComponent } from "./components/link-component.tsx";
import { createImgComponent } from "./components/img-component.tsx";
import { createHeadingComponent } from "./components/heading-component.tsx";
import {
  createUlComponent,
  createOlComponent,
  createLiComponent,
  createInputComponent,
} from "./components/list-components.tsx";
import { createCodeComponent, createPreComponent } from "./components/code-components.tsx";
import { createBlockquoteComponent } from "./components/blockquote-component.tsx";
import { createSpanComponent } from "./components/span-component.tsx";
import {
  createTableComponent,
  createTheadComponent,
  createTbodyComponent,
  createTrComponent,
  createThComponent,
  createTdComponent,
} from "./components/table-components.tsx";
import {
  createHrComponent,
  createSectionComponent,
  createSvgComponent,
} from "./components/other-components.tsx";

/**
 * Creates a React Markdown component map backed by InstUI components.
 */
export function createInstuiMarkdownComponents(
  renderOptions: InstuiMarkdownRenderOptions = {},
): Components {
  const showAlertCloseButton = Boolean(renderOptions.alert?.closeButton);
  const tableLayout = renderOptions.table?.display ?? "auto";
  const tableHover = Boolean(renderOptions.table?.hover);
  const tableSortable = Boolean(renderOptions.table?.sortable);
  const showExternalIcon = Boolean(renderOptions.link?.externalIcon);
  const showPermalinks = Boolean(renderOptions.link?.permalinks);
  const permalinkClassName = renderOptions.link?.permalinkClassName ?? "mdx-heading-anchor";
  const codeEditable = renderOptions.code?.editable ?? false;
  const codeReadOnly = renderOptions.code?.readOnly ?? true;
  const codeLineNumbers = renderOptions.code?.lineNumbers;
  const codeLineWrapping = renderOptions.code?.lineWrapping;
  const codeSpellCheck = renderOptions.code?.spellCheck;
  const codeHighlightActiveLine = renderOptions.code?.highlightActiveLine;
  const codeDirection = renderOptions.code?.direction;
  const showColorCodes = Boolean(renderOptions.color?.enabled);
  const showIcons = Boolean(renderOptions.icons?.enabled);
  const iconColor = renderOptions.icons?.color;

  return {
    span: createSpanComponent({
      showColorCodes,
      showIcons,
      iconColor,
    }) as any,
    a: createLinkComponent({
      showExternalIcon,
      showPermalinks,
      permalinkClassName,
    }) as any,
    img: createImgComponent(),
    p: createPComponent(),
    em: createEmComponent(),
    strong: createStrongComponent(),
    del: createDelComponent(),
    code: createCodeComponent({
      showColorCodes,
      codeEditable,
      codeReadOnly,
      codeLineNumbers,
      codeLineWrapping,
      codeSpellCheck,
      codeHighlightActiveLine,
      codeDirection,
    }),
    pre: createPreComponent(),
    blockquote: createBlockquoteComponent({
      showAlertCloseButton,
    }),
    hr: createHrComponent(),
    h1: createHeadingComponent("h1"),
    h2: createHeadingComponent("h2"),
    h3: createHeadingComponent("h3"),
    h4: createHeadingComponent("h4"),
    h5: createHeadingComponent("h5"),
    h6: createHeadingComponent("h6"),
    ins: createInsComponent(),
    ul: createUlComponent(),
    ol: createOlComponent(),
    li: createLiComponent(),
    input: createInputComponent(),
    section: createSectionComponent(),
    svg: createSvgComponent(),
    sub: createSubComponent(),
    sup: createSupComponent(),
    table: createTableComponent({
      tableLayout,
      tableHover,
      tableSortable,
    }),
    thead: createTheadComponent(),
    tbody: createTbodyComponent({
      tableSortable,
    }),
    tr: createTrComponent(),
    th: createThComponent({
      tableSortable,
    }),
    td: createTdComponent(),
  };
}

/**
 * Default markdown component map using package defaults.
 */
export const instuiMarkdownComponents: Components = createInstuiMarkdownComponents();
