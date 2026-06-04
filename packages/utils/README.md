# utils

Internal utilities shared across the `instui-markdown` monorepo. This package isn't intended for direct use outside the monorepo.

## API

### `mapCodeLanguage(className?)`

Parses a markdown fence class name (e.g. `"language-tsx"`) and returns a normalized `EditorLanguage` value. Falls back to `"markdown"` when no recognized language is found.

```ts
mapCodeLanguage("language-tsx");  // "javascript"
mapCodeLanguage("language-yml");  // "yaml"
mapCodeLanguage(undefined);       // "markdown"
```

Supported output values: `"json"`, `"yaml"`, `"markdown"`, `"css"`, `"html"`, `"javascript"`.

---

### `isExternalHref(href?)`

Returns `true` when a link href points to an external target — an absolute URL (`http://`, `https://`, or `//`) or a `mailto:` / `tel:` scheme.

```ts
isExternalHref("https://example.com");  // true
isExternalHref("mailto:hi@example.com"); // true
isExternalHref("#anchor");              // false
isExternalHref(undefined);             // false
```

---

### `normalizeCodeValue(content)`

Strips a trailing newline from raw code node content and joins array values into a single string.

```ts
normalizeCodeValue("const x = 1;\n");        // "const x = 1;"
normalizeCodeValue(["line1\n", "line2\n"]);  // "line1\nline2"
normalizeCodeValue(null);                    // ""
```

---

### `isInlineCode(content, className?)`

Returns `true` when code content should be treated as inline (no language class and no newlines).

```ts
isInlineCode("foo()", undefined);          // true
isInlineCode("a\nb", undefined);           // false
isInlineCode("foo()", "language-js");      // false
```
