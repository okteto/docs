# Agent instructions for the Okteto docs

This file is loaded automatically by Claude Code (and other agents that read `CLAUDE.md` / `AGENTS.md`) for every session in this repo. Read it before doing anything in this codebase.

## Mandatory: read the style guide first

Before editing **any** file under `src/content/`, `src/pages/`, `versioned_docs/`, or any `.mdx`/`.md` doc page, you must read [`STYLE_GUIDE.md`](STYLE_GUIDE.md) in full. It is the source of truth for voice, tone, page structure, formatting, and terminology. The rules below are a quick-reference subset — when in doubt, defer to `STYLE_GUIDE.md`.

If `STYLE_GUIDE.md` is not present in the working tree (e.g. on an old branch), stop and tell the user before continuing.

## Tone of voice — the rules agents miss most

These patterns are the most common drift in agent-authored docs. Treat each as a hard "don't" and apply the substitution.

**Banned words and phrases.** Do not use any of these unless quoting product copy verbatim:

- `powerful`, `seamless`, `intelligent`, `foundational`, `comprehensive`, `robust`, `cutting-edge`, `enterprise-grade`
- `Learn more →`, `Click here`, `Read more about`
- `In this guide, you will learn...`, `In this section we will...`
- `Before you start, it helps to understand...`, `Before diving in...`
- `Useful for [X]` (describe what the feature does instead)
- Stacked synonyms like `consistent, reproducible, and reliable` — pick one
- Marketing phrases describing what the docs *contain* (e.g. `Guides, references, and tutorials.`)

**Required patterns:**

- Open every page with the subject (feature name or "Okteto") followed by what it does. No preamble.
- Section headings are noun phrases (`Configuring the Garbage Collector`), not questions or imperatives.
- Embed links inline. Never use standalone "Learn more" lines or arrow links.
- Frontmatter `description` is one functional sentence. No marketing language.

If you find yourself reaching for an adjective, ask whether it adds technical meaning. If not, cut it.

## Capitalization canon — non-negotiable

Use these exact spellings and capitalizations. The full table is in [`STYLE_GUIDE.md`](STYLE_GUIDE.md#terminology); the cases agents most often get wrong:

| Term | Correct form | Notes |
|------|--------------|-------|
| Okteto product names | `Okteto CLI`, `Okteto Manifest`, `Okteto Registry`, `Okteto Build Service`, `Garbage Collector`, `Admin Dashboard`, `Okteto Test`, `Okteto AI`, `Okteto API` | Always capitalized. "the CLI" is OK after first reference. |
| Manifest filename | `okteto.yaml` | Lowercase, code-formatted (backticks). The product name is `Okteto Manifest`. |
| CLI commands | `okteto up`, `okteto deploy`, `okteto test`, `okteto build` | Lowercase, in backticks. |
| Deployment models | `Self-Hosted`, `BYOC`, `SaaS` | All capitalized exactly as shown. `BYOC` is always uppercase. First reference: `Bring Your Own Cloud (BYOC)`. |
| Environments | `Development Environment`, `Preview Environment`, `Development Container` | Capitalized when referring to the Okteto feature. Lowercase when generic. |
| Namespaces | `Namespace` (Okteto) vs. `namespace` (generic Kubernetes) | Capitalization signals which one you mean. |
| Roles | `Admin`, `Developer`, `Personal Access Token` | Capitalized when referring to the Okteto role. |
| Features | `Divert`, `Remote Execution`, `File Sync`, `Volume Snapshot`, `Agentic Workflows` | Capitalized as feature names. |
| Third-party | `Kubernetes`, `BuildKit`, `GitHub Actions`, `Docker Compose`, `Helm` | Match upstream casing. Never `k8s` in prose. |

## Where docs live

- `src/content/` — the **current** unreleased version. **All new content goes here.**
- `versioned_docs/version-X.Y/` — frozen snapshots of past versions. Don't edit unless backporting an explicit fix.
- `src/pages/` — top-level pages (archives, etc.).
- `static/` — images and assets. Use the `+X.Y` filename suffix when an image only applies to specific versions (see [`README.md`](README.md#image)).
- `src/content/variables.json` — version variables (`cliVersion`, `chartVersion`, etc.) used in MDX via the variables plugin.

File extension is `.mdx` for content pages. Frontmatter requires a `description` field — write it per [`STYLE_GUIDE.md`](STYLE_GUIDE.md#frontmatter-description).

## Pre-submit checklist

Run through this before declaring any docs change complete:

1. **Read the diff aloud.** Does any sentence start with preamble (`Before you start...`, `In this guide...`)? Cut it.
2. **Grep your additions for banned words:** `powerful`, `seamless`, `intelligent`, `foundational`, `comprehensive`, `Learn more`, `Useful for`. None should appear.
3. **Check every Okteto noun you introduced** against the capitalization canon above. `Self-Hosted` (not `self-hosted`), `BYOC` (not `byoc`), `okteto.yaml` in backticks, `Okteto CLI` (not `Okteto cli` or `okteto CLI`).
4. **Verify links are inline**, not standalone "Learn more →" lines.
5. **Confirm the frontmatter `description`** is a single functional sentence — no marketing copy.
6. **Run `yarn build`** if you touched more than a single page. The build catches broken anchors and version mismatches.
7. **For new feature docs:** confirm you opened with the subject + what it does, and that section headings are noun phrases.

## Special workflows

### Cutting a new docs version

If the user asks you to release a new version of the docs, follow the [Quick Reference for Automation](README.md#quick-reference-for-automation) section in `README.md`. It lists every file to modify and the parameters involved. Do not improvise — the file count and order matter (versions.json, docusaurus.config.js, netlify.toml, archives.md, release-notes.mdx all need coordinated edits).

### Building locally

```
yarn install
yarn start    # dev server
yarn build    # production build, used to catch broken links
```

### Commits

Per `CONTRIBUTING.md`, commits must be signed off (`git commit -s`). Do not skip this — it's a DCO requirement.

## When you're unsure

Read [`STYLE_GUIDE.md`](STYLE_GUIDE.md) and grep existing docs for examples. The correct pattern almost always exists somewhere in `src/content/`. If a canonical pattern isn't clear, ask the user before inventing one — terminology and tone consistency are more important than speed.
