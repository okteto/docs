# "Copy page / Open in agent" Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a split button next to every latest-version docs page title that copies the page as Markdown or opens it in Claude / ChatGPT / GitHub Copilot.

**Architecture:** A new `AgentActions` theme component renders a "Copy page" split button with a dropdown. It is injected by ejecting `DocItem/Content` from `@docusaurus/theme-classic` and rendering `<AgentActions />` beside the synthetic H1, gated on `useDocsVersion().isLast`. The `.md` twins it links to are already generated at build time by `@signalwire/docusaurus-plugin-llms-txt`.

**Tech Stack:** Docusaurus 3.10 (classic theme), React 19, plain JS (no TypeScript), global SCSS via `docusaurus-plugin-sass`, PostHog (already loaded via `posthog-docusaurus`).

**Spec:** `docs/superpowers/specs/2026-08-07-agent-actions-design.md`

## Global Constraints

- No new npm dependencies. Icons come from simple-icons SVG paths (CC0), committed as React components.
- Plain JavaScript only — this repo does not use TypeScript in `src/`.
- Global SCSS convention: components import `./styles.scss` with plain class names (see `src/theme/Button`). No CSS modules for theme components.
- All commits must be signed off: `git commit -s` (DCO requirement from CONTRIBUTING.md).
- UI copy, exact strings: `Copy page`, `Copied`, `Copy failed`, `View as Markdown`, `Open in Claude`, `Open in ChatGPT`, `Open in GitHub Copilot`.
- Prompt string (before URL-encoding): `Read <absolute-md-url> so I can ask questions about it.`
- PostHog event name `docs_agent_action`; properties `action` (`copy` | `view_markdown` | `open_claude` | `open_chatgpt` | `open_copilot`) and `doc_path`.
- Version gate: `useDocsVersion().isLast` from `@docusaurus/plugin-content-docs/client`. Root `/docs/` pages are version 1.47 (`lastVersion`); `/docs/1.48/` is the unreleased current version and has **no** `.md` twins.
- `.md` twins exist only in build output (generated in `postBuild`). Verify with `yarn build && yarn serve`, never `yarn start`.
- There is no JS test framework in this repo. Each task's test cycle is: `yarn build` (must exit 0) plus `grep` assertions against `build/` output, then browser checks in the final task.

## File Structure

- `src/icons/agent/MarkdownIcon.js` — markdown-mark SVG icon component (new)
- `src/icons/agent/ClaudeIcon.js` — Claude logo icon component (new)
- `src/icons/agent/OpenAIIcon.js` — OpenAI logo icon component (new)
- `src/icons/agent/CopilotIcon.js` — GitHub Copilot logo icon component (new)
- `src/theme/AgentActions/index.js` — split button + dropdown, copy logic, deep links, analytics (new)
- `src/theme/AgentActions/styles.scss` — component styles, Infima variables for dark mode (new)
- `src/theme/DocItem/Content/index.js` — ejected from theme-classic, adds title row + gating (new)

---

### Task 1: Agent icon components

**Files:**
- Create: `src/icons/agent/MarkdownIcon.js`
- Create: `src/icons/agent/ClaudeIcon.js`
- Create: `src/icons/agent/OpenAIIcon.js`
- Create: `src/icons/agent/CopilotIcon.js`

**Interfaces:**
- Consumes: nothing.
- Produces: four default-export React components, each rendering a 16×16 `<svg viewBox="0 0 24 24">` with `fill="currentColor"`, accepting spread props. Import paths used by Task 2: `../../icons/agent/MarkdownIcon` etc.

- [ ] **Step 1: Generate the four icon components from simple-icons**

simple-icons SVGs are CC0-licensed, single-path, 24×24. **Note:** simple-icons has removed the `openai` and `chatgpt` icons (brand takedown — verified 404 on the CDN), so `OpenAIIcon.js` is hand-authored as a neutral chat-bubble glyph instead (Step 1b). This script downloads the other three, extracts the path data, and writes the component files:

```bash
mkdir -p src/icons/agent
for pair in "markdown MarkdownIcon" "claude ClaudeIcon" "githubcopilot CopilotIcon"; do
  set -- $pair
  d=$(curl -fsSL "https://cdn.simpleicons.org/$1" | sed -n 's/.*<path d="\([^"]*\)".*/\1/p')
  if [ -z "$d" ]; then echo "FAILED to extract path for $1" && exit 1; fi
  cat > "src/icons/agent/$2.js" <<EOF
import React from 'react';

const $2 = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="$d" />
  </svg>
);

export default $2;
EOF
done
```

- [ ] **Step 2: Verify all four files have real path data**

Run: `grep -c 'path d="M' src/icons/agent/*.js`

Expected output — each file reports exactly `1`:

```
src/icons/agent/ClaudeIcon.js:1
src/icons/agent/CopilotIcon.js:1
src/icons/agent/MarkdownIcon.js:1
src/icons/agent/OpenAIIcon.js:1
```

If any reports `0`, the CDN response changed shape; open the downloaded SVG manually and paste its `d` attribute into the template above.

- [ ] **Step 1b: Hand-author `src/icons/agent/OpenAIIcon.js`**

The filename stays `OpenAIIcon.js` because Task 2 imports that path; the glyph is a neutral chat bubble since the brand icon is unavailable:

```js
import React from 'react';

const OpenAIIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 4c-4.97 0-9 3.13-9 7 0 2.22 1.33 4.2 3.4 5.48-.12.9-.53 2.06-1.4 3.02 1.85-.14 3.32-.86 4.28-1.55.86.22 1.77.34 2.72.34 4.97 0 9-3.13 9-7s-4.03-7-9-7z" />
  </svg>
);

export default OpenAIIcon;
```

- [ ] **Step 3: Commit**

```bash
git add src/icons/agent
git commit -s -m "feat(theme): add agent/markdown icon components"
```

---

### Task 2: AgentActions component wired into ejected DocItem/Content

**Files:**
- Create: `src/theme/AgentActions/index.js`
- Create: `src/theme/AgentActions/styles.scss`
- Create: `src/theme/DocItem/Content/index.js`

**Interfaces:**
- Consumes: icon components from Task 1 (`src/icons/agent/*.js`).
- Produces: `<AgentActions />` (default export, no props) — renders the split button; only ever mounted by `src/theme/DocItem/Content/index.js` when `useDocsVersion().isLast` is true. CSS classes `docTitleRow`, `AgentActions`, `AgentActions__copy`, `AgentActions__toggle`, `AgentActions__menu`.

- [ ] **Step 1: Write `src/theme/AgentActions/index.js`**

```js
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import MarkdownIcon from '../../icons/agent/MarkdownIcon';
import ClaudeIcon from '../../icons/agent/ClaudeIcon';
import OpenAIIcon from '../../icons/agent/OpenAIIcon';
import CopilotIcon from '../../icons/agent/CopilotIcon';

import './styles.scss';

const COPY_RESET_MS = 2000;

function capture(action, docPath) {
  if (
    typeof window !== 'undefined' &&
    window.posthog &&
    typeof window.posthog.capture === 'function'
  ) {
    window.posthog.capture('docs_agent_action', { action, doc_path: docPath });
  }
}

const AgentActions = () => {
  const { pathname } = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState('idle'); // 'idle' | 'copied' | 'error'
  const rootRef = useRef(null);
  const toggleRef = useRef(null);

  // Markdown twins live at the page path with `.md` appended; the docs root
  // (`/docs/`) is the one exception, served as `index.md`.
  const cleanPath = pathname.replace(/\/+$/, '');
  const basePath = siteConfig.baseUrl.replace(/\/+$/, '');
  const mdPath = cleanPath === basePath ? `${basePath}/index.md` : `${cleanPath}.md`;
  const mdUrl = `${siteConfig.url}${mdPath}`;
  const prompt = encodeURIComponent(`Read ${mdUrl} so I can ask questions about it.`);

  const menuItems = [
    { label: 'View as Markdown', href: mdPath, action: 'view_markdown', Icon: MarkdownIcon },
    { label: 'Open in Claude', href: `https://claude.ai/new?q=${prompt}`, action: 'open_claude', Icon: ClaudeIcon },
    { label: 'Open in ChatGPT', href: `https://chatgpt.com/?hints=search&q=${prompt}`, action: 'open_chatgpt', Icon: OpenAIIcon },
    { label: 'Open in GitHub Copilot', href: `https://github.com/copilot?prompt=${prompt}`, action: 'open_copilot', Icon: CopilotIcon },
  ];

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onMouseDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        if (toggleRef.current) {
          toggleRef.current.focus();
        }
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleCopy = async () => {
    try {
      const res = await fetch(mdPath);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      capture('copy', pathname);
    } catch {
      // Twins only exist in built output, so this fires in `yarn start` dev
      // mode (or offline). Show the error state briefly; nothing to log.
      setCopyState('error');
    }
    setTimeout(() => setCopyState('idle'), COPY_RESET_MS);
  };

  const copyLabel =
    copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy page';

  return (
    <div className="AgentActions" ref={rootRef}>
      <button type="button" className="AgentActions__copy" onClick={handleCopy}>
        <MarkdownIcon />
        {copyLabel}
      </button>
      <button
        type="button"
        className="AgentActions__toggle"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More ways to open this page"
        ref={toggleRef}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className="AgentActions__menu" role="menu">
          {menuItems.map(({ label, href, action, Icon }) => (
            <li key={action} role="none">
              <a
                role="menuitem"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  capture(action, pathname);
                  setOpen(false);
                }}
              >
                <Icon />
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgentActions;
```

- [ ] **Step 2: Write `src/theme/AgentActions/styles.scss`**

Uses Infima CSS variables throughout so dark mode needs no `[data-theme='dark']` overrides:

```scss
.docTitleRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  column-gap: 1rem;
  flex-wrap: wrap;
}

.AgentActions {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 0.4rem;
  font-size: 0.875rem;

  &__copy,
  &__toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.7rem;
    background: var(--ifm-background-surface-color);
    border: 1px solid var(--ifm-color-emphasis-300);
    color: var(--ifm-font-color-base);
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    line-height: 1.2;

    &:hover {
      background: var(--ifm-color-emphasis-100);
    }
  }

  &__copy {
    border-radius: 6px 0 0 6px;
    border-right: none;
    white-space: nowrap;
  }

  &__toggle {
    border-radius: 0 6px 6px 0;
    padding-left: 0.45rem;
    padding-right: 0.45rem;
  }

  &__menu {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    z-index: var(--ifm-z-index-dropdown);
    min-width: 230px;
    margin: 0;
    padding: 0.3rem;
    list-style: none;
    background: var(--ifm-background-surface-color);
    border: 1px solid var(--ifm-color-emphasis-300);
    border-radius: 8px;
    box-shadow: var(--ifm-global-shadow-md);

    li {
      margin: 0;
    }

    a {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0.6rem;
      border-radius: 6px;
      color: var(--ifm-font-color-base);
      text-decoration: none;
      white-space: nowrap;

      &:hover {
        background: var(--ifm-color-emphasis-100);
        color: var(--ifm-font-color-base);
        text-decoration: none;
      }
    }
  }
}
```

- [ ] **Step 3: Eject `DocItem/Content` with the title row and version gate**

Write `src/theme/DocItem/Content/index.js`. This is the stock component from `@docusaurus/theme-classic` 3.10 (`node_modules/@docusaurus/theme-classic/src/theme/DocItem/Content/index.tsx`) converted to JS, with three changes: the `useDocsVersion` import, the `docTitleRow` class on the header, and the gated `<AgentActions />`. The `clsx` call is replaced with a template literal so we don't import an undeclared dependency:

```js
import React from 'react';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc, useDocsVersion } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import AgentActions from '../../AgentActions';

/**
 Ejected from @docusaurus/theme-classic 3.10 to render AgentActions beside
 the synthetic title. Re-check against upstream on Docusaurus major upgrades.

 The synthetic title renders when the page uses a frontmatter `title` and the
 markdown body has no top-level h1 — true for every page in this repo.
*/
function useSyntheticTitle() {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({ children }) {
  const syntheticTitle = useSyntheticTitle();
  // Markdown twins are only generated for the version served at the docs
  // root (lastVersion) and for unversioned instances like tutorials — both
  // report isLast. Old versions and /docs/1.48/ (unreleased) do not.
  const { isLast } = useDocsVersion();
  return (
    <div className={`${ThemeClassNames.docs.docMarkdown} markdown`}>
      {syntheticTitle && (
        <header className={isLast ? 'docTitleRow' : undefined}>
          <Heading as="h1">{syntheticTitle}</Heading>
          {isLast && <AgentActions />}
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
```

- [ ] **Step 4: Build**

Run: `yarn build`

Expected: exits 0. This compiles the new components (they are now imported), catches syntax errors, SCSS errors, and broken imports. Takes several minutes.

- [ ] **Step 5: Verify the gate in build output**

```bash
grep -c 'AgentActions' build/docs/index.html
grep -c 'AgentActions' build/docs/tutorials/compose-getting-started/index.html
grep -c 'AgentActions' build/docs/1.46/index.html || echo "absent-1.46"
grep -c 'AgentActions' build/docs/1.48/index.html || echo "absent-1.48"
```

Expected: the first two print a number ≥ 1 (control server-rendered on latest-version and tutorial pages); the last two print `0` then `absent-1.46` / `absent-1.48` (grep exits nonzero — control absent on old and unreleased versions).

Also confirm the twins still generate: `ls build/docs/index.md build/docs/llms.txt` — both exist.

- [ ] **Step 6: Commit**

```bash
git add src/theme/AgentActions src/theme/DocItem
git commit -s -m "feat(theme): add Copy page / Open in agent control to docs pages"
```

---

### Task 3: Browser verification pass

**Files:**
- Modify (only if fixes are needed): `src/theme/AgentActions/index.js`, `src/theme/AgentActions/styles.scss`

**Interfaces:**
- Consumes: the built site from Task 2.
- Produces: verified behavior; any styling/behavior fixes committed.

- [ ] **Step 1: Serve the production build**

Run: `yarn serve --dir build/docs`

The build script writes to `build/docs` (custom `--out-dir`), but the `serve` script's default dir is `build/` — without `--dir build/docs`, every page 404s. Serves at `http://localhost:8080/docs/`; leave running in the background.

- [ ] **Step 2: Verify control placement and copy action**

Open `http://localhost:8080/docs/core/okteto-manifest`:
- Split button appears right of the H1, on the same row, not overlapping the title.
- Click **Copy page** → label flips to `Copied` for ~2s; clipboard contains Markdown starting with the `> **Documentation Index**:` pointer line.

- [ ] **Step 3: Verify the dropdown**

- Click the caret → menu opens with 4 items, each with an icon: `View as Markdown`, `Open in Claude`, `Open in ChatGPT`, `Open in GitHub Copilot`.
- **View as Markdown** opens `/docs/core/okteto-manifest.md` in a new tab showing raw Markdown.
- Each agent link's `href` contains `q=` (or `prompt=` for Copilot) with the URL-encoded prompt `Read https://www.okteto.com/docs/core/okteto-manifest.md so I can ask questions about it.` (verify via right-click → copy link, no need to actually sign in to each product).
- Escape closes the menu and focus returns to the caret; clicking outside closes it.

- [ ] **Step 4: Verify gating and edge pages**

- `http://localhost:8080/docs/` (root): control present; **View as Markdown** opens `/docs/index.md`.
- `http://localhost:8080/docs/tutorials/compose-getting-started`: control present.
- `http://localhost:8080/docs/1.46/`: control absent.
- `http://localhost:8080/docs/1.48/`: control absent.

- [ ] **Step 5: Verify dark mode and narrow viewport**

- Toggle the site theme to dark: button, borders, and menu use dark surfaces (no hard-coded white), text legible.
- At ~375px width: the control wraps below the title without horizontal overflow; menu stays within the viewport (right-aligned).

- [ ] **Step 6: Commit any fixes**

```bash
git add src/theme/AgentActions
git commit -s -m "fix(theme): polish AgentActions styling from browser verification"
```

Skip this commit if no fixes were needed.

---

## Out of Scope

- Markdown twins for versioned docs (would require `includeVersionedDocs: true` and ballooning build output).
- An "Open in Codex" entry — no public prefill URL exists; the ChatGPT link is the OpenAI-side equivalent.
- Keyboard arrow-key navigation within the menu (Escape/click-outside/tab order covered; full roving tabindex is YAGNI for a 4-item menu).
- Changes to docs content, `llms.txt` generation, or the generated Markdown.
