// Swizzled (ejected): a page with a right column (blog posts and tutorials)
// gives it the width of the right column of the docs, so the three sites look
// the same, and the main column takes the rest (see src/theme/BlogPostPage).
// Pages without it are unchanged.

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

import styles from './styles.module.scss';

export default function BlogLayout(props) {
  const { sidebar, toc, children, ...layoutProps } = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <BlogSidebar sidebar={sidebar} />
          <main
            className={clsx('col', {
              'col--7': hasSidebar && !toc,
              'col--6': hasSidebar && toc,
              'col--9 col--offset-1': !hasSidebar && !toc,
              [styles.main]: !hasSidebar && toc,
            })}>
            {children}
          </main>
          {toc && <div className={clsx('col', hasSidebar ? 'col--3' : styles.toc)}>{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
