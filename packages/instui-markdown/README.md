# instui-markdown

React components for rendering markdown with [Instructure UI](https://instructure.design) components.

## Installation

```bash
npm install instui-markdown rehype-instui-markdown
```

You also need the InstUI peer dependencies your app will use. At minimum:

```bash
npm install react react-markdown remark-gfm rehype-raw rehype-slug \
  @instructure/ui-text @instructure/ui-heading @instructure/ui-link \
  @instructure/ui-list @instructure/ui-view
```

## Usage

### `InstuiMarkdown`

Renders a markdown string using InstUI components.

```tsx
import { InstuiMarkdown } from "instui-markdown";

<InstuiMarkdown>{markdownString}</InstuiMarkdown>
```

Pass `renderOptions` to control rendering behavior:

```tsx
<InstuiMarkdown
  renderOptions={{
    link: { permalinks: true, externalIcon: true },
    table: { sortable: true, hover: true },
    code: { lineNumbers: true },
    color: { enabled: true },
    icons: { enabled: true },
  }}
>
  {markdownString}
</InstuiMarkdown>
```

### `InstuiMdxProvider`

Wraps MDX content and maps MDX elements to InstUI components.

```tsx
import { InstuiMdxProvider } from "instui-markdown";
import Content from "./content.mdx";

<InstuiMdxProvider renderOptions={renderOptions}>
  <Content />
</InstuiMdxProvider>
```

### `createInstuiMarkdownComponents`

Returns the component map directly if you need to pass it to `react-markdown` or an MDX provider yourself.

```tsx
import ReactMarkdown from "react-markdown";
import { createInstuiMarkdownComponents } from "instui-markdown";

const components = createInstuiMarkdownComponents(renderOptions);

<ReactMarkdown components={components}>{markdown}</ReactMarkdown>
```

## Render options

### `alert`

Controls alert-styled blockquotes. Uses [GFM alert syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts): `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `closeButton` | `boolean` | `false` | Shows a dismiss button on each alert |

### `table`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `display` | `"auto" \| "stacked" \| "fixed"` | `"auto"` | InstUI table layout mode |
| `hover` | `boolean` | `false` | Highlights rows on hover |
| `sortable` | `boolean` | `false` | Enables sortable column headers |

### `link`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `externalIcon` | `boolean` | `false` | Adds an icon to external links |
| `permalinks` | `boolean` | `false` | Appends a permalink anchor to each heading |
| `permalinkClassName` | `string` | `"mdx-heading-anchor"` | CSS class on permalink anchor elements |

### `code`

Fenced code blocks render using the InstUI `SourceCodeEditor`. Supported languages: `json`, `yaml`, `markdown`, `css`, `html`, `javascript` (and aliases `js`, `jsx`, `ts`, `tsx`, `yml`).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `editable` | `boolean` | `false` | Allows editing code blocks |
| `readOnly` | `boolean` | `true` | Marks code blocks as read-only |
| `lineNumbers` | `boolean` | `false` | Shows line numbers |
| `lineWrapping` | `boolean` | `false` | Wraps long lines |
| `spellCheck` | `boolean` | `false` | Enables spell check in editable blocks |
| `highlightActiveLine` | `boolean` | `false` | Highlights the cursor's line |
| `direction` | `"ltr" \| "rtl"` | `"ltr"` | Text direction |

### `color`

Wraps color literals in a visual swatch. Supports `#hex`, `rgb()`, `rgba()`, `hsl()`, and `hsla()` formats. Skips color values inside code fences.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Renders color swatches inline |

### `icons`

Renders InstUI icons from `:iconName:` tokens. Supports Line, Solid, and Lucide icon variants. You can omit the `Icon` prefix and the `Line`/`Solid` suffix — `:Heart:`, `:HeartLine:`, and `:IconHeartLine:` all resolve to the same icon.

Add an optional hex color with a pipe: `:Heart|#F00:`.

Skips icon tokens inside code fences.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Renders `:icon:` tokens as InstUI icons |
| `color` | `string` | `undefined` | Default icon color (hex) for all icon tokens |

## Peer dependencies

`instui-markdown` requires the following peer dependencies. Install only what your content uses — the components map each markdown element to the matching InstUI package.

| Package | Used for |
| --- | --- |
| `react` | All components |
| `react-markdown` | Markdown parsing |
| `remark-gfm` | GFM tables, task lists, strikethrough |
| `rehype-raw` | Inline HTML in markdown |
| `rehype-slug` | Heading IDs |
| `rehype-autolink-headings` | Heading permalink anchors |
| `@mdx-js/react` | `InstuiMdxProvider` |
| `@instructure/ui-alerts` | `> [!NOTE]` and other alerts |
| `@instructure/ui-badge` | Color swatch badges |
| `@instructure/ui-checkbox` | Task list items |
| `@instructure/ui-color-utils` | Color contrast for swatches |
| `@instructure/ui-heading` | `h1`–`h6` |
| `@instructure/ui-icons` | Icon tokens and permalink icons |
| `@instructure/ui-img` | Images |
| `@instructure/ui-link` | Links |
| `@instructure/ui-list` | Ordered and unordered lists |
| `@instructure/ui-source-code-editor` | Fenced code blocks |
| `@instructure/ui-svg-images` | Inline SVG elements |
| `@instructure/ui-table` | Tables |
| `@instructure/ui-text` | Paragraphs and inline text |
| `@instructure/ui-view` | Block wrappers and horizontal rules |
