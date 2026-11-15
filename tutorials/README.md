# Okteto Tutorials

The tutorials at https://www.okteto.com/tutorials/ are built from this
folder, as a site of their own with the same look as the blog: an index of
cards with the cover of each tutorial, and the same page layout as a post.

```
tutorials/
  posts/2026-11-14-helm/
    index.mdx          the tutorial
    img/               its images (img/cover.jpg is the cover)
```

## Writing a tutorial

1. Create a folder in `tutorials/posts/` named `<date>-<slug>`, with an
   `index.mdx` inside and the tutorial's images in `img/`.
2. Start the file with front matter:

   ```yaml
   ---
   title: "Develop a Helm application with Okteto"
   description: "One functional sentence for search results, link previews and the card."
   slug: helm                     # URL: /tutorials/helm/. Never change it once published.
   date: 2026-11-14               # orders the tutorials (newest first); never shown
   image: ./img/cover.jpg         # cover, card image and social card
   image_alt: "The Helm logo with an arrow to the Kubernetes logo"
   ---
   ```

   The cover is drawn with `scripts/covers`, like every cover and diagram of
   the docs, the tutorials and the blog: see "Images" in
   [`AGENTS.md`](../AGENTS.md#images).
3. Write the tutorial in MDX, following [`STYLE_GUIDE.md`](../STYLE_GUIDE.md).
   Link docs pages with root-relative URLs (`/docs/reference/okteto-cli/`) and
   other tutorials the same way (`/tutorials/helm/`).
4. Run `yarn develop:tutorials` and open http://localhost:8082/tutorials/.
5. Open a pull request. Merging to `main` publishes it.

Tutorials aren't versioned: they link to the official version of the docs.

## How it is built

`docusaurus.tutorials.config.js` builds `/tutorials/` into
`build/tutorials`, with the same blog plugin (`src/plugins/okteto-blog`),
theme (`src/theme/Blog*`) and styles (`src/styles/blog.scss`) as the blog. It
also writes `/tutorials/llms.txt` and a Markdown twin of every tutorial.

`yarn build` runs the three builds: docs, tutorials, and blog.

Links from a tutorial to the docs are links to another site: the build turns
them into plain links (see `remarkCrossSiteLinks` in `config/shared.js`) and
doesn't check them. When a docs page moves, update the tutorials that link to
it.
