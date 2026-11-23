// Swizzled (ejected): links the BlogPosting of a blog post or a tutorial to the
// site-level JSON-LD graph of its site (config/jsonld.js). The original block
// has no publisher and isn't connected to the Organization, the WebSite or the
// product, so answer engines and search have to infer who publishes the page.
//
// The references come from the site's `customFields.jsonLd` (pageJsonLdRefs in
// config/jsonld.js). A site that doesn't set it gets the original block.

import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useBlogPostStructuredData } from '@docusaurus/plugin-content-blog/client';

function withSiteGraph(post, refs) {
  if (!refs) {
    return post;
  }
  const hasAuthors = Array.isArray(post.author) ? post.author.length > 0 : Boolean(post.author);

  return {
    ...post,
    // A page without authors, such as a tutorial, is written by the Organization.
    author: hasAuthors ? post.author : refs.publisher,
    publisher: refs.publisher,
    ...(refs.about ? { about: refs.about } : {}),
    // The page is part of the Blog entity of Docusaurus (the list of posts),
    // which is part of the WebSite of the site-level graph.
    isPartOf: { ...post.isPartOf, isPartOf: refs.website },
  };
}

export default function BlogPostStructuredData() {
  const { siteConfig } = useDocusaurusContext();
  const structuredData = withSiteGraph(useBlogPostStructuredData(), siteConfig.customFields?.jsonLd);

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Head>
  );
}
