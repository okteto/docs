# Agent instructions for the Okteto docs

This file is loaded automatically by Claude Code and the other agents that read `AGENTS.md` for every session in this repo. Read it before doing anything in this codebase.

## Mandatory: read the style guide first

Before editing **any** file under `src/content/`, `src/pages/`, `versioned_docs/`, `tutorials/`, or `blog/`, or any `.mdx`/`.md` page, you must read [`STYLE_GUIDE.md`](STYLE_GUIDE.md) in full. It is the source of truth for voice, tone, page structure, formatting, and terminology, and it applies the same way to the docs, the tutorials, and the blog. The rules below are a quick-reference subset. When in doubt, defer to `STYLE_GUIDE.md`.

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
- Section headings are noun phrases (`Configuring the Garbage Collector`), not questions or imperatives. The only exception is the `###` questions inside a `## FAQ` section (see [`STYLE_GUIDE.md`](STYLE_GUIDE.md#section-headings)).
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

### Search terms

`ephemeral environment` (lowercase) is a term people search for a lot. Use it in the docs where it's true: for the application environments that live for one pull request or one agent task, Okteto creates them on demand and deletes them when the work ends. It describes how long an environment lives, so it doesn't replace `application environment` (the category, as opposed to the agent sandbox) or the feature names (`Preview Environment`, `Development Environment`).

## Confidential information

This repo and its PRs are public. Never include in docs, commits, PR titles or PR descriptions:

- Customer or prospect names, or details that identify them (domains, cluster names, IPs, support bundle contents)
- Links to internal resources: Slack threads, Jira tickets, private GitHub repos or PRs (e.g. okteto/app), internal dashboards
- Unreleased roadmap, pricing or contract details, license keys, tokens or credentials

Describe the problem generically instead (e.g. "clusters where the ingress controller Service is IPv6-first").

## Where docs live

- `src/content/`: the **current** unreleased version. **All new content goes here.**
- `versioned_docs/version-X.Y/`: frozen snapshots of released versions. By default, changes go only to `src/content/` (the next version), because most of them document features that ship in it. Copy a change to the official version (`lastVersion` in `docusaurus.config.js`) or older ones only when the user asks.
- `src/pages/`: top-level pages (archives, etc.).
- `tutorials/`: the tutorials, served at `/tutorials/` as a site of their own with the look of the blog (`docusaurus.tutorials.config.js`). One folder per tutorial in `tutorials/posts/`, with its images. They aren't versioned. See [`tutorials/README.md`](tutorials/README.md).
- `blog/`: the blog, served at `/blog/` (`docusaurus.blog.config.js`). See [`blog/README.md`](blog/README.md).
- `config/shared.js`: what the three sites share (navbar, footer, search, analytics, styles), and the links between them. A page links to a page of another site with a root-relative URL (`/tutorials/helm/` from the docs, `/docs/reference/okteto-cli/` from a tutorial): the build turns it into a plain link and doesn't check it.
- `src/clientModules/mixpanel.js`: analytics for the three sites, in the Mixpanel "Website" project that okteto.com uses too. Page views, clicks, and scrolls are captured automatically; calls to action send `Click <label>`, the event name of okteto.com. To send a new event, call its `track()` with an event name in the style of the existing ones (`404 Page Viewed`, `Newsletter Subscribed`). Automated browsers aren't tracked, and `?analytics=off` on any page stops tracking your browser (`?analytics=on` undoes it).
- `static/`: images and assets. Use the `+X.Y` filename suffix when an image only applies to specific versions (see [`README.md`](README.md#image)).
- `src/content/variables.json`: version variables (`cliVersion`, `chartVersion`, etc.), imported in MDX. Never hardcode a version.

File extension is `.mdx` for content pages. Frontmatter requires a `description` field. Write it per [`STYLE_GUIDE.md`](STYLE_GUIDE.md#frontmatter-description).

## Images

The docs, the tutorials, and the blog draw their images the same way, with one generator (`scripts/covers`) and one style, defined in `scripts/covers/style.mjs`. Every tutorial and every blog post has a cover image in that style:

- **Subject:** what the article is about, never its title (the title is already next to the image). Draw a schematic of the idea (a flow, a box with its parts, a comparison), or big logos when the article is about an integration (`Okteto + Argo`, `Helm to Kubernetes`).
- **Look:** neon lines on navy (`#1a2640`), over one of six backgrounds with an 80s feel in the colors of Okteto: `dots` (halftone dots fading from two corners), `weave` (a band of halftone dots across the cover), `grid` (a faint grid in perspective along the bottom edge), `sun` (a striped retro sun rising from the bottom-right corner), `hexagons` (a honeycomb of thin outlines fading in from two corners, the pattern of the older Okteto covers), and `stars` (a starfield with a few neon sparkles). These six are the only backgrounds of the covers. A comparison of Okteto with another vendor (Okteto vs mirrord, vs Qovery, and so on, a post whose folder contains `okteto-vs-` or `okteto-versus-`) always uses `stars`, and no other post does. The other posts rotate through the other five: `covers.mjs` gives each one the next background in date order, so consecutive posts never share it. The tutorials rotate through the same five, on their own. Don't set `background` on a cover. When you add or remove a post or a tutorial, render every cover again (`node scripts/covers/render.mjs img/cover.jpg`), because the rotation shifts.
- **Simplicity:** one idea, a handful of shapes, and few labels of one to three words, in Circular Bold. The image has to read at the width of a card (about 300px).
- **Colors:** teal (`#00d1ca`) for Okteto and for environments, blue (`#4d8dff`) for Kubernetes boxes, purple (`#b44cff`) for agents, and amber (`#ffb13b`) or red (`#ff5c7a`) for warnings, cost, and blocked paths.

When you draw the subject:

- Show each idea once. If two elements say the same thing (for example, "Kubernetes credentials" in a box and RBAC next to it), keep one.
- Draw only what the article covers. Don't add related concepts to fill the image.
- Don't wrap elements in extra boxes or layers. A control over a connection, such as RBAC, is a label on the arrow, not a box around one of its ends.
- An application looks like a real one: its Kubernetes resources by name (HTTPRoute, Service, Pods, Volume) in a short chain, not generic shapes.
- Leave a margin of about 80px on each side: the blog cards crop the sides of the image. Keep the labels readable on any background: away from the corners (`dots`, `sun`, `hexagons`) and off the bottom edge (`grid`, `sun`).
- Draw one or two covers first and iterate on them with the user before applying a change of style to many.

Images inside a blog post or a tutorial, and diagrams in the docs (the `Image` component with `borderless`), are shown at the width of the cover (at most 40rem), centered. The styles do it (`src/styles/blog.scss`, `src/styles/main.scss`, and `src/theme/Image/styles.module.scss`), so don't size or align images one by one.

Images inside a page (a blog post, a tutorial, or a docs page) have a white background. In a docs page, show a diagram with the `borderless` prop of `Image`, so it has no frame around it; the frame is for screenshots of the product. Diagrams use the same shapes and the same generator as the covers, without the dark background and the glow: add an entry to `scripts/covers/covers.mjs` with `background: 'white'`, a function as its `svg`, and an output in the page's image folder (for a post or a tutorial, a `.webp` file of its `img/` folder other than `cover.jpg`). A diagram uses the same canvas as a cover (1200x630, rendered at 2400x1260), so it has the same size and proportions as the cover it's shown under. Fit the drawing to that canvas and keep its text at 22px or more on it, so it stays readable on a phone. When you redraw an existing diagram in this style, change only the style: keep its elements, names, URLs, connections, and alternative text as they are.

Diagrams in the docs share these shapes. The `deploy-movies-app` and `environment-workflow` entries of `scripts/covers/covers.mjs` are the reference:

- **An application environment** is a blue box with the Kubernetes mark on the middle of its top edge, the title "Application environment" and "Okteto Namespace" under it, and its services as stacked rows: a line icon (`box` for a service, `database` for a database or a queue) and the name. The rows are narrower than the box and centered in it.
- **A person or an agent** is a circle with a line icon and the label under it: `user` for a developer, `bot` for a coding agent.
- **An endpoint** (a URL, a path such as `/api`) is a pill: a rounded box whose radius is half its height. Pills that lead into an environment sit on its border, with the same height, and end at the same point inside it. A long URL can go down to 18px so its pill doesn't take the whole width.
- **Arrows** are short, and the arrows of the same flow have the same length. Draw only the connections the page explains.
- **Balance:** center the drawing on the canvas, with the same white space on each side.

### Logos and icons

- **Okteto:** `mark('okteto')` draws the symbol (`static/img/logos/okteto.svg`) and `mark('okteto-wordmark')` draws the symbol with the name (`shared/static/img/logo.svg`). Use those files as they are: don't redraw or recolor them.
- **Kubernetes:** `mark('kubernetes')` draws the official mark, the white wheel on the blue (`#326ce5`) heptagon, with one corner up. Never put the wheel on a circle or on any other shape.
- **Other brands:** single-color marks from `scripts/covers/logos/` (from [Simple Icons](https://simpleicons.org)), in a brand color that reads on the dark background (the `BRANDS` table of `style.mjs`). To add one, save its SVG in that folder and add its color to the table. If a brand has no mark there, write its name with `word()`.
- **Icons:** line icons from `scripts/covers/icons/` (from [Lucide](https://lucide.dev)). To add one, save its SVG in that folder.
- **Kubernetes resources:** take the [Kubernetes icon set](https://github.com/kubernetes/community/tree/main/icons) as the reference for diagrams of Kubernetes architectures: one recognizable shape per resource type (Pod, Deployment, Service, Ingress, Namespace, Volume, Secret, and so on), used the same way in every diagram, and the cluster or namespace as the box that contains them. Draw them in the style of `style.mjs` (line icons and the palette above), not as the blue icons of the set.

### Adding or changing a cover

1. Add or edit the entry in `scripts/covers/covers.mjs`: the output path, the `alt` text, and the subject, built with the helpers of `style.mjs` (`row`, `group`, `hub`, `badge`, `tile`, `mark`, and others). Start from the closest existing cover.
2. Run `node scripts/covers/render.mjs <filter>`. The filter is a part of the output path, such as the post's folder; without it, the script renders every cover. It needs Google Chrome. Covers are 2400x1260.
3. Look at the image, also at the size of a card, and simplify it until it reads at a glance.
4. In the post or the tutorial, set the cover and its alternative text (the `alt` of the entry) in the frontmatter:

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
7. **For new feature docs:** confirm you opened with the subject + what it does, and that section headings are noun phrases (questions only inside a `## FAQ` section).
8. **Check every image or table you added at phone width** (390px, an iPhone). Text inside images must stay readable (about 11px or more on screen): give wide diagrams a stacked version with the `mobileSrc` prop of `Image`. Tables must fit the screen without scrolling sideways. Headless Chrome can't make its window narrower than about 500px, so emulate the device (Chrome DevTools, or `Emulation.setDeviceMetricsOverride` over the DevTools protocol) instead of resizing the window.
9. **Check for confidential information** in the docs, commit messages and PR description: no customer names, internal links or credentials (see [Confidential information](#confidential-information)).

## Special workflows

### Cutting a new docs version

If the user asks you to release a new version of the docs, follow the [Quick Reference for Automation](README.md#quick-reference-for-automation) section in `README.md`. It lists every file to modify and the parameters involved. Do not improvise: the file count and order matter (versions.json, docusaurus.config.js, netlify.toml, archives.md, release-notes.mdx all need coordinated edits).

### Building locally

```
yarn install
yarn start                # docs dev server: http://localhost:8080/docs/
yarn develop:tutorials    # tutorials dev server: http://localhost:8082/tutorials/
yarn develop:blog         # blog dev server: http://localhost:8081/blog/
yarn build                # production build of the three sites, used to catch broken links
```

### Commits

Per `CONTRIBUTING.md`, commits must be signed off (`git commit -s`). Do not skip this: it's a DCO requirement.

## When you're unsure

Read [`STYLE_GUIDE.md`](STYLE_GUIDE.md) and grep existing docs for examples. The correct pattern almost always exists somewhere in `src/content/`. If a canonical pattern isn't clear, ask the user before inventing one. Terminology and tone consistency are more important than speed.
