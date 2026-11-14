# Agent instructions for the Okteto docs

This file is loaded automatically by Claude Code and the other agents that read `AGENTS.md` for every session in this repo. Read it before doing anything in this codebase.

## Mandatory: read the style guide first

Before editing **any** file under `src/content/`, `src/pages/`, `versioned_docs/`, or any `.mdx`/`.md` doc page, you must read [`STYLE_GUIDE.md`](STYLE_GUIDE.md) in full. It is the source of truth for voice, tone, page structure, formatting, and terminology. The rules below are a quick-reference subset. When in doubt, defer to `STYLE_GUIDE.md`.

If `STYLE_GUIDE.md` is not present in the working tree (for example, on an old branch), stop and tell the user before continuing.

## Feature context

Each task comes with the context of the feature to document. Document only what that context and the repo state. If a behavior, default value, or UI label isn't in either, ask the user instead of guessing.

## Tone of voice: the rules agents miss most

These patterns are the most common drift in agent-authored docs. Treat each as a hard "don't" and apply the substitution.

**Banned words and phrases.** Do not use any of these unless quoting product copy verbatim:

- `powerful`, `seamless`, `intelligent`, `foundational`, `comprehensive`, `robust`, `cutting-edge`, `enterprise-grade`
- `Learn more →`, `Click here`, `Read more about`
- `In this guide, you will learn...`, `In this section we will...`, `This guide will walk you through...`, `Please note that`
- `Before you start, it helps to understand...`, `Before diving in...`
- `Useful for [X]` (describe what the feature does instead)
- Stacked synonyms like `consistent, reproducible, and reliable`. Pick one
- Marketing phrases describing what the docs *contain* (for example, `Guides, references, and tutorials.`)
- Em dashes (`—`). Use a comma, a colon, parentheses, or two sentences

**Required patterns:**

- Open every page with the subject (feature name or "Okteto") followed by what it does. No preamble.
- Section headings are noun phrases (`Configuring the Garbage Collector`), not questions or imperatives.
- Embed links inline. Never use standalone "Learn more" lines or arrow links.
- Frontmatter `description` is one functional sentence. No marketing language.
- Address the reader as "you". Use present tense and active voice.
- Every page stands on its own: readers, including AI coding agents, land on one section mid-task. Commands, flags, and paths are complete and exact; prerequisites and destructive steps are stated; no "above" or "below" references.
- Links point to the `.mdx` file relative to `src/content/`. Images use `<Image>` with `alt`, never `![]()`.

If you find yourself reaching for an adjective, ask whether it adds technical meaning. If not, cut it.

## Capitalization canon

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

- `src/content/`: the **current** unreleased version. **All new content goes here.**
- `versioned_docs/version-X.Y/`: frozen snapshots of released versions. By default, changes go only to `src/content/` (the next version), because most of them document features that ship in it. Copy a change to the official version (`lastVersion` in `docusaurus.config.js`) or older ones only when the user asks.
- `src/pages/`: top-level pages (archives, etc.).
- `static/`: images and assets. Use the `+X.Y` filename suffix when an image only applies to specific versions (see [`README.md`](README.md#image)).
- `src/content/variables.json`: version variables (`cliVersion`, `chartVersion`, etc.), imported in MDX. Never hardcode a version.

File extension is `.mdx` for content pages. Frontmatter requires a `description` field. Write it per [`STYLE_GUIDE.md`](STYLE_GUIDE.md#frontmatter-description).

## Tutorials

Tutorials are step-by-step guides to do something with Okteto that have to keep working as the product changes. They live in `src/content/tutorials/` (and in the official version's copy, so they're served at `/docs/tutorials/`), and are listed on the tutorials index page, not in the sidebar. Ideas, opinion, comparisons, and news go to the blog instead.

Every tutorial has a cover image, like a blog post. To add a tutorial:

1. Create its cover, as described in [Cover images](#cover-images). It goes to `static/img/tutorials/covers/<id>.jpg`.
2. Set the cover in the tutorial's frontmatter, for the card on the index page and for link previews:

   ```yaml
   sidebar_custom_props: { image: "/img/tutorials/covers/<id>.jpg" }
   image: /img/tutorials/covers/<id>.jpg
   ```

3. Add the tutorial to the `Tutorials` category in `sidebars.js`.

## Cover images

Every blog post and every tutorial has a cover image. The covers of the tutorials and of the new blog posts share one style, defined in `scripts/covers/style.mjs` (older posts keep the cover they had until it is redrawn):

- **Subject:** what the article is about, never its title (the title is already next to the image). Draw a schematic of the idea (a flow, a box with its parts, a comparison), or big logos when the article is about an integration (`Okteto + Argo`, `Helm to Kubernetes`).
- **Look:** neon lines on a night-blue background, with a faint 80s grid along the bottom edge. Nothing else goes in the background: no sun, stars, or patterns behind the subject.
- **Simplicity:** one idea, a handful of shapes, and few labels of one to three words, in Circular Bold. The image has to read at the width of a card (about 300px).
- **Colors:** teal (`#00d1ca`) for Okteto and for environments, blue (`#4d8dff`) for Kubernetes boxes, purple (`#b44cff`) for agents, and amber (`#ffb13b`) or red (`#ff5c7a`) for warnings, cost, and blocked paths.

### Logos and icons

- **Okteto:** `mark('okteto')` draws the symbol (`static/img/logos/okteto.svg`) and `mark('okteto-wordmark')` draws the symbol with the name (`shared/static/img/logo.svg`). Use those files as they are: don't redraw or recolor them.
- **Kubernetes:** `mark('kubernetes')` draws the official mark, the white wheel on the blue (`#326ce5`) heptagon, with one corner up. Never put the wheel on a circle or on any other shape.
- **Other brands:** single-color marks from `scripts/covers/logos/` (from [Simple Icons](https://simpleicons.org)), in a brand color that reads on the dark background (the `BRANDS` table of `style.mjs`). To add one, save its SVG in that folder and add its color to the table. If a brand has no mark there, write its name with `word()`.
- **Icons:** line icons from `scripts/covers/icons/` (from [Lucide](https://lucide.dev)). To add one, save its SVG in that folder.

### Adding or changing a cover

1. Add or edit the entry in `scripts/covers/covers.mjs`: the output path, the `alt` text, and the subject, built with the helpers of `style.mjs` (`row`, `group`, `hub`, `badge`, `tile`, `mark`, and others). Start from the closest existing cover.
2. Run `node scripts/covers/render.mjs <filter>`. The filter is a part of the output path, such as the tutorial id or the post's folder; without it, the script renders every cover. It needs Google Chrome. Blog covers are 2400x1260 and tutorial covers are 1200x630.
3. Look at the image, also at the size of a card, and simplify it until it reads at a glance.
4. In a blog post, set the cover and its alternative text (the `alt` of the entry) in the frontmatter:

   ```yaml
   image: ./img/cover.jpg
   image_alt: "The Okteto logo plus the Argo logo"
   ```

## Pre-submit checklist

Run through this before declaring any docs change complete:

1. **Read the diff aloud.** Does any sentence start with preamble (`Before you start...`, `In this guide...`)? Cut it.
2. **Grep your additions for banned words:** `powerful`, `seamless`, `intelligent`, `foundational`, `comprehensive`, `Learn more`, `Useful for`, `—`. None should appear.
3. **Check every Okteto noun you introduced** against the capitalization canon above. `Self-Hosted` (not `self-hosted`), `BYOC` (not `byoc`), `okteto.yaml` in backticks, `Okteto CLI` (not `Okteto cli` or `okteto CLI`).
4. **Verify links are inline**, not standalone "Learn more →" lines.
5. **Confirm the frontmatter `description`** is a single functional sentence, with no marketing copy.
6. **Run `yarn build`** if you touched more than a single page. The build catches broken anchors and version mismatches.
7. **For new feature docs:** confirm you opened with the subject + what it does, and that section headings are noun phrases.
8. **Check every image or table you added at phone width** (390px, an iPhone). Text inside images must stay readable (about 11px or more on screen): give wide diagrams a stacked version with the `mobileSrc` prop of `Image`. Tables must fit the screen without scrolling sideways. Headless Chrome can't make its window narrower than about 500px, so emulate the device (Chrome DevTools, or `Emulation.setDeviceMetricsOverride` over the DevTools protocol) instead of resizing the window.

## Special workflows

### Cutting a new docs version

If the user asks you to release a new version of the docs, follow the [Quick Reference for Automation](README.md#quick-reference-for-automation) section in `README.md`. It lists every file to modify and the parameters involved. Do not improvise: the file count and order matter (versions.json, docusaurus.config.js, netlify.toml, archives.md, release-notes.mdx all need coordinated edits).

### Building locally

```
yarn install
yarn start    # dev server
yarn build    # production build, used to catch broken links
```

### Commits

Per `CONTRIBUTING.md`, commits must be signed off (`git commit -s`). Do not skip this: it's a DCO requirement.

## When you're unsure

Read [`STYLE_GUIDE.md`](STYLE_GUIDE.md) and grep existing docs for examples. The correct pattern almost always exists somewhere in `src/content/`. If a canonical pattern isn't clear, ask the user before inventing one. Terminology and tone consistency are more important than speed.
