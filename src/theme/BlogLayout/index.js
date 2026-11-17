// Swizzled (ejected): every page of the blog and the tutorials has a right
// column, with the width of the right column of the docs, and the main column
// takes the rest. A post passes its own column (src/theme/BlogPostPage, with
// its table of contents); the post lists get the signup alone
// (src/components/blog/Aside).

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

import Aside from '@site/src/components/blog/Aside';
import styles from './styles.module.scss';

export default function BlogLayout(props) {
  const { sidebar, toc = <Aside />, children, ...layoutProps } = props;
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
