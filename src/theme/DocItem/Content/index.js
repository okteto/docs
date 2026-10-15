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
 markdown body has no top-level h1. Pages whose body starts with its
 own `# h1` get a bare actions row above the content instead.
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
      {!syntheticTitle && isLast && (
        <div className="docTitleRow docTitleRow--bare">
          <AgentActions />
        </div>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
