# rehype-instui-markdown

Rehype plugins for use with [instui-markdown](https://www.npmjs.com/package/instui-markdown). They add color swatch markup, icon token markup, and blockquote unwrapping to the rehype pipeline.

## Installation

```bash
npm install rehype-instui-markdown
```

## Plugins

### `rehypeColorCodes`

Wraps color literals in `<span class="color-code" data-color="…">` elements so a downstream renderer can display a visual swatch. Supports `#hex` (3, 4, 6, and 8 digit), `rgb()`, `rgba()`, `hsl()`, and `hsla()` formats. Skips any content inside `<pre>` or `<code>` blocks.

```ts
import { rehypeColorCodes } from "rehype-instui-markdown";
```

Input:

```markdown
The background is #1f2937 and the border is rgba(14, 165, 233, 0.6).
```

Output (simplified):

```html
The background is <span class="color-code" data-color="#1f2937">#1f2937</span>
and the border is <span class="color-code" data-color="rgba(14, 165, 233, 0.6)">rgba(14, 165, 233, 0.6)</span>.
```

---

### `rehypeInstUIIconTokens`

Wraps `:iconName:` and `:iconName|color:` tokens in `<span class="icon-token" data-icon="…">` elements so a downstream renderer can swap them for real icon components. Skips any content inside `<pre>` or `<code>` blocks.

```ts
import { rehypeInstUIIconTokens } from "rehype-instui-markdown";
```

Token syntax:

```
:IconName:
:IconName|#hexcolor:
```

Input:

```markdown
Save your work :IconSaveLine: or discard :IconTrashLine|#E00:.
```

Output (simplified):

```html
Save your work <span class="icon-token" data-icon="IconSaveLine">:IconSaveLine:</span>
or discard <span class="icon-token" data-icon="IconTrashLine" data-icon-color="#E00">:IconTrashLine|#E00:</span>.
```

---

### `rehypeUnwrapBlockquoteParagraphs`

Unwraps bare `<p>` elements inside `<blockquote>` nodes, hoisting their children directly into the blockquote. This prevents invalid nesting when a downstream component maps blockquotes to elements that expect inline children.

```ts
import { rehypeUnwrapBlockquoteParagraphs } from "rehype-instui-markdown";
```

## Using the plugins directly

All three plugins work with any rehype-compatible pipeline.

```ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import {
  rehypeColorCodes,
  rehypeInstUIIconTokens,
  rehypeUnwrapBlockquoteParagraphs,
} from "rehype-instui-markdown";

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeUnwrapBlockquoteParagraphs)
  .use(rehypeInstUIIconTokens)
  .use(rehypeColorCodes)
  .use(rehypeStringify)
  .process(markdownString);
```
