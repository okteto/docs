# Okteto Blog

The blog at https://www.okteto.com/blog/ is built from this folder. Writing,
reviewing and publishing a post all happen in this repo, through a pull
request. There is no CMS.

```
blog/
  posts/2026-09-10-compare-okteto-versus-bunnyshell/
    index.mdx          the post
    img/               its images
  authors.yml          one entry per author
  tags.yml             the allowed tags
  static/              files served as-is under /blog/ (author photos, social cards,
                       assets of pre-2022 posts)
```

## Writing a post

1. Create a folder in `blog/posts/` named `<date>-<slug>`, with an `index.mdx`
   inside and the post's images in `img/`.
2. Start the file with front matter:

   ```yaml
   ---
   title: "Okteto vs Bunnyshell: Choosing the Right Kubernetes Environment Platform"
   description: "One sentence for search results and link previews."
   slug: compare-okteto-versus-bunnyshell     # URL: /blog/compare-okteto-versus-bunnyshell/
   date: 2026-09-10                             # orders posts (newest first); never shown
   authors: ["ramiro-berrelleza"]               # keys from authors.yml
   tags: ["kubernetes", "development-environments"]   # keys from tags.yml
   image: ./img/cover.jpg                       # featured image and social card
   image_alt: "Okteto and Bunnyshell logos"
   ---
   ```

3. Write the post in Markdown. Put `{/* truncate */}` after the first
   paragraph: everything above it is the excerpt.
4. Run `yarn develop:blog` and open http://localhost:8081/blog/.
5. Open a pull request. The PR gets a preview environment with the post
   rendered on the real layout. Merging to `main` publishes it.

To work on a post without publishing it, add `draft: true`. Drafts show up in
`yarn develop:blog` but are left out of the production build.

### Optional front matter

| Field | What it does |
| --- | --- |
| `title_meta` | `<title>` and og:title when they should differ from the visible title |
| `excerpt` | Card text on the blog index, when it should differ from `description` |
| `social_image` | Social card when it should differ from the featured image. Absolute path into `blog/static`, e.g. `/img/social/<slug>.jpg` |
| `hide_featured_image` | `true` keeps `image` as the social card but doesn't show it on the page |
| `series` | Series name. Posts with the same series get a "Part N of M" box, ordered by date |
| `related` | Up to two post slugs to show as "Related content". Filled up with recent posts that share a tag |

### Components

Markdown covers text, headings, lists, code, tables and images
(`![alt](./img/diagram.webp)`). For anything else, import a component at the
top of the post:

```mdx
import { YouTube, CallToAction, CustomerQuote } from '@site/src/components/blog';
```

| Component | Example |
| --- | --- |
| `YouTube` | `<YouTube id="7Fty6qwhdtk" />` |
| `Video` | `<Video src={require('./img/demo.mp4').default} />` |
| `CallToAction` | `<CallToAction title="See Okteto in action" actions={[{ label: 'Request a demo', url: 'https://www.okteto.com/get-demo/' }]} />` |
| `BlogButton` | `<BlogButton href="https://www.okteto.com/get-demo/" arrow>Request a demo</BlogButton>` |
| `CustomerQuote` | `<CustomerQuote quote="..." author="Name" role="Title, Company" />` |
| `Highlight` | `<Highlight>` Markdown here `</Highlight>` (shaded box) |
| `Figure` | `<Figure src={require('./img/x.webp').default} alt="..." caption="..." float="left" />` |
| `Tweet`, `Arcade`, `Logos` | Embeds used by a few older posts |

Collapsible sections use plain HTML: `<details><summary>Title</summary>...</details>`.

### Authors and tags

Add a new author to `authors.yml` (photo in `blog/static/img/authors/`). Their
page is `/blog/authors/<key>/`. Tags must exist in `tags.yml`, the build fails
on unknown tags, which keeps near-duplicates like `preview-environment` and
`preview-environments` from multiplying.

## How it is built

The docs and the blog are two Docusaurus sites in one repo, because
Docusaurus applies `baseUrl` to the whole site:

- `docusaurus.config.js` builds `/docs/` into `build/docs`.
- `docusaurus.blog.config.js` builds `/blog/` into `build/blog`.
- `config/shared.js` holds what both share: navbar, footer, favicons, Prism
  theme, analytics (GA, GTM, Mixpanel, HubSpot) and styles. `shared/static`
  holds the fonts, favicons and logo. The React theme in `src/theme` and
  `src/styles` is shared too.
- `src/plugins/okteto-blog` wraps the stock blog plugin to keep the old URLs
  (`/blog/page-2/`, tag pages for unused tags), compute series and related
  posts, and write `/blog/posts.json` for okteto.com pages that list posts.

`yarn build` builds both. `yarn build:blog` ends with
`scripts/blog-migrate/verify-urls.mjs`, which fails the build if any URL the
old blog served (`scripts/blog-migrate/legacy-urls.txt`) is missing.

## Migration from Sanity

`scripts/blog-migrate/sanity-to-mdx.mjs` generated everything in this folder
from the published Sanity `blogPost` documents. It is idempotent; rerun it
right before the cutover to pick up edits made in Sanity since:

```
node scripts/blog-migrate/sanity-to-mdx.mjs ../website/static/blog
```

After the cutover, delete the script: this folder is the source of truth.
