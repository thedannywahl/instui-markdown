# instui-markdown

A monorepo of React components and rehype plugins for rendering markdown with [Instructure UI](https://instructure.design) components.

## Packages

| Package | Version | Description |
| --- | --- | --- |
| [`instui-markdown`](./packages/instui-markdown) | [![npm](https://img.shields.io/npm/v/instui-markdown)](https://www.npmjs.com/package/instui-markdown) | React components for rendering markdown with InstUI |
| [`rehype-instui-markdown`](./packages/rehype-instui-markdown) | [![npm](https://img.shields.io/npm/v/rehype-instui-markdown)](https://www.npmjs.com/package/rehype-instui-markdown) | Rehype plugins for color and icon token transforms |

## Demo

Try it live at [thedannywahl.github.io/instui-markdown](https://thedannywahl.github.io/instui-markdown/).

## Development

Install dependencies:

```bash
vp install
```

Check formatting, linting, and types:

```bash
vp check
```

Run tests:

```bash
vp run -r test
```

Build all packages:

```bash
vp run -r build
```

Run the website dev server:

```bash
vp run website#dev
```

## Publishing

Use `pnpm publish` — it rewrites `workspace:*` dependencies to real version numbers automatically.

```bash
cd packages/rehype-instui-markdown && pnpm publish --no-git-checks
cd packages/instui-markdown && pnpm publish --no-git-checks
```

Publish `rehype-instui-markdown` first since `instui-markdown` depends on it.
