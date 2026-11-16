// Swizzled (wrapped): on the release notes, in every version of the docs, the
// right column holds the signup to the product updates email on top and the
// table of contents under it. Other pages keep the stock column.

import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import TOC from '@theme/TOC';
import TOCDesktop from '@theme-original/DocItem/TOC/Desktop';

import { ProductUpdatesAside } from '@site/src/components/ProductUpdatesSignup';
import styles from './styles.module.scss';

export default function TOCDesktopWrapper(props) {
  const { metadata, toc, frontMatter } = useDoc();

  if (metadata.id !== 'release-notes') {
    return <TOCDesktop {...props} />;
  }

  return (
    <aside className={styles.aside}>
      <ProductUpdatesAside />
      <TOC
        toc={toc}
        minHeadingLevel={frontMatter.toc_min_heading_level}
        maxHeadingLevel={frontMatter.toc_max_heading_level}
        className={clsx(ThemeClassNames.docs.docTocDesktop, styles.toc)}
      />
    </aside>
  );
}
