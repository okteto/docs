# Design: "Copy page / Open in agent" control on docs pages

**Date:** 2026-08-07
**Status:** Approved

## Goal

Surface the Markdown twins that already ship with every docs build (via
`@signalwire/docusaurus-plugin-llms-txt`, PRs #1276 and #1298) as a visible,
one-click control on every current-version docs page, so readers can copy a
page as Markdown or hand it directly to a coding agent.

## Background

- Every current-version page (including the tutorials instance) gets a `.md`
  twin at the page URL with `.md` appended (e.g. `/docs/testing.md`).
- Twins are generated at build time (`postBuild`), so they do not exist under
  `yarn start` dev mode. Testing requires `yarn build && yarn serve`.
- Versioned pages (`/docs/1.46/...`) have no twins
  (`includeVersionedDocs: false`).
- Each twin already embeds a pointer to `llms.txt`, so an agent that fetches
  one page discovers the full docs index.

## UI

New theme component `src/theme/AgentActions/` (`index.js` + `styles.scss`,
following existing `src/theme/Button` conventions; no new dependencies).

Rendered as a compact split button, right-aligned on the same row as the H1:

- **Primary action — "Copy page":** fetches the page's `.md` twin (relative
  URL) and writes it to the clipboard. Label flips to "Copied" for ~2 seconds.
- **Caret — dropdown menu**, each item with an inline SVG icon:
  1. **View as Markdown** — opens `<page-path>.md` in a new tab (relative
     URL, so it works on deploy previews and local `yarn serve`).
  2. **Open in Claude** — `https://claude.ai/new?q=<prompt>`
  3. **Open in ChatGPT** — `https://chatgpt.com/?hints=search&q=<prompt>`
  4. **Open in GitHub Copilot** — `https://github.com/copilot?prompt=<prompt>`

Prompt text (URL-encoded): `Read <absolute-md-url> so I can ask questions
about it.` The absolute URL is always production
(`siteConfig.url` + path + `.md`), because agents must be able to fetch it
publicly.

## Injection and gating

- Eject `DocItem/Content` into `src/theme/DocItem/Content/index.js` (copied
  from `@docusaurus/theme-classic` 3.10) and wrap the synthetic-title H1 in a
  flex row with `<AgentActions />`. All docs pages use frontmatter titles, so
  the H1 always renders here. Matches existing repo practice (DocPaginator is
  already ejected).
- Render the control only when `useDoc().metadata.version` is `'current'`
  (covers the main docs instance and the unversioned tutorials instance).
  Versioned pages get no control.
- Path derivation: `useLocation().pathname`, strip trailing slash, append
  `.md`. Special case: the docs root `/docs/` maps to `/docs/index.md`.

## Behavior and error handling

- Dropdown closes on click-outside, Escape, or item selection.
  `aria-haspopup="menu"` and `aria-expanded` on the caret button.
- If the markdown fetch fails (dev mode, offline), the button shows a brief
  "Copy failed" state. No crash, no console spam.
- Dark mode via Infima CSS variables. On narrow screens the control wraps
  below the title.

## Analytics

One PostHog event per interaction, guarded with `window.posthog?.capture`
(posthog-docusaurus is already loaded):

- Event: `docs_agent_action`
- Properties: `action` (`copy` | `view_markdown` | `open_claude` |
  `open_chatgpt` | `open_copilot`), `doc_path` (pathname)

## Testing

`yarn build && yarn serve`, then verify:

1. Control present and copy works on a current-version page and a tutorial
   page.
2. Control absent on a versioned page (e.g. `/docs/1.46/...`).
3. Each deep link opens the target product with the prompt prefilled.
4. Dropdown keyboard behavior (Escape closes, focus returns to trigger).
5. Dark mode and mobile-width rendering.

## Out of scope

- Markdown twins for versioned docs.
- An "Open in Codex" entry (no public prefill URL; the ChatGPT link is the
  OpenAI-side equivalent).
- Any changes to docs content or generated Markdown output.
