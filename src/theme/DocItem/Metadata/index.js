import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  useActiveDocContext,
  useDoc,
  useDocsSidebar,
  useDocsVersion,
} from '@docusaurus/plugin-content-docs/client';
import Metadata from '@theme-original/DocItem/Metadata';

/**
 Wraps the original DocItem/Metadata to add a page-level JSON-LD block
 (TechArticle + BreadcrumbList) to every doc page, in every version and in
 the tutorials plugin. URLs, title, description and breadcrumbs come from the
 doc metadata at build time, so nothing needs updating when a version is cut.

 The @id references point at the site-level graph declared in
 docusaurus.config.js (siteJsonLd). Keep both in sync.
*/

// Extra breadcrumb level for docs plugins other than the main one.
const PLUGIN_ROOT_LABELS = { tutorials: 'Tutorials' };

const withSlash = (path) => (path.endsWith('/') ? path : `${path}/`);

// Returns the chain of sidebar items (categories and the doc link) leading to
// the given permalink, or null when the doc isn't in the sidebar.
function findSidebarTrail(items, permalink) {
  for (const item of items) {
    if (item.href && withSlash(item.href) === permalink) {
      return [item];
    }
    if (item.type === 'category') {
      const trail = findSidebarTrail(item.items, permalink);
      if (trail) {
        return [item, ...trail];
      }
    }
  }
  return null;
}

function usePageJsonLd() {
  const { siteConfig } = useDocusaurusContext();
  const { metadata } = useDoc();
  const { pluginId } = useDocsVersion();
  const { activeVersion } = useActiveDocContext(pluginId);
  const sidebar = useDocsSidebar();

  const siteUrl = siteConfig.url;
  const docsRoot = `${siteUrl}${siteConfig.baseUrl}`;
  const permalink = withSlash(metadata.permalink);
  const pageUrl = `${siteUrl}${permalink}`;
  const versionRoot = withSlash(activeVersion?.path ?? siteConfig.baseUrl);

  const article = {
    '@type': 'TechArticle',
    '@id': `${pageUrl}#article`,
    headline: metadata.title,
    description: metadata.description,
    mainEntityOfPage: pageUrl,
    isPartOf: { '@id': `${docsRoot}#website` },
    about: { '@id': `${siteUrl}/#product` },
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en-US',
  };
  if (metadata.lastUpdatedAt) {
    article.dateModified = new Date(metadata.lastUpdatedAt).toISOString();
  }

  const graph = [article];

  // No breadcrumb for a version's landing page: it would be a single item.
  if (permalink !== versionRoot) {
    const crumbs = [];
    if (pluginId in PLUGIN_ROOT_LABELS) {
      crumbs.push({ name: 'Documentation', item: docsRoot });
      crumbs.push({ name: PLUGIN_ROOT_LABELS[pluginId], item: `${siteUrl}${versionRoot}` });
    } else {
      crumbs.push({ name: 'Documentation', item: `${siteUrl}${versionRoot}` });
    }
    // Categories without their own page can't be linked, so they're skipped.
    const trail = findSidebarTrail(sidebar?.items ?? [], permalink) ?? [];
    trail
      .slice(0, -1)
      .filter((item) => item.href && withSlash(item.href) !== versionRoot)
      .forEach((item) => crumbs.push({ name: item.label, item: `${siteUrl}${withSlash(item.href)}` }));
    crumbs.push({ name: metadata.title });

    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        ...crumb,
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export default function MetadataWrapper(props) {
  const jsonLd = usePageJsonLd();
  return (
    <>
      <Metadata {...props} />
      <Head>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
    </>
  );
}
