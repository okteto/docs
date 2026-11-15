// Swizzled (replaced): a post ends with a link back to the index instead of
// the "Newer post" and "Older post" links. The tutorials set their own label
// (`customFields.allPostsLabel`).

import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './styles.module.scss';

export default function BlogPostPaginator() {
  const { siteConfig } = useDocusaurusContext();
  const label = siteConfig.customFields?.allPostsLabel ?? 'All posts';
  return (
    <nav className={styles.back} aria-label="Blog post page navigation">
      <Link to="/">← {label}</Link>
    </nav>
  );
}
