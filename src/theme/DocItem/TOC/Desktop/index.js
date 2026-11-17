// Swizzled (wrapped): on every page of the docs, in every version, the right
// column holds the signup to the product updates email on top and the table of
// contents under it. Pages without a table of contents have no right column.

import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import TOC from '@theme/TOC';

import { ProductUpdatesAside } from '@site/src/components/ProductUpdatesSignup';
import styles from './styles.module.scss';

export default function TOCDesktopWrapper() {
  const { metadata, toc, frontMatter } = useDoc();
  // The release notes keep their own name in the analytics of the form.
  const instance = metadata.id === 'release-notes' ? 'release-notes-aside' : 'docs-aside';

  return (
    <aside className={styles.aside}>
      <ProductUpdatesAside instance={instance} />
      <TOC
        toc={toc}
        minHeadingLevel={frontMatter.toc_min_heading_level}
        maxHeadingLevel={frontMatter.toc_max_heading_level}
        className={clsx(ThemeClassNames.docs.docTocDesktop, styles.toc)}
      />
    </aside>
  );
}
