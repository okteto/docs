// Swizzled (replaced): a post ends with a link back to the blog index instead
// of the "Newer post" and "Older post" links.

import React from 'react';
import Link from '@docusaurus/Link';

import styles from './styles.module.scss';

export default function BlogPostPaginator() {
  return (
    <nav className={styles.back} aria-label="Blog post page navigation">
      <Link to="/">← All posts</Link>
    </nav>
  );
}
