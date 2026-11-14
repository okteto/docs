// Swizzled (ejected): a page with a right column (blog posts) gives it three
// of the twelve grid columns instead of two, so the newsletter signup fits
// there (see src/theme/BlogPostPage). Pages without it are unchanged.

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

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
              'col--9': !hasSidebar && toc,
            })}>
            {children}
          </main>
          {toc && <div className="col col--3">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
