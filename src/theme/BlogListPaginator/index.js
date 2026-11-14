// Swizzled (wrapped): the blog index, tag and author pages end with the same
// callout as the posts, below the pagination.

import React from 'react';
import BlogListPaginator from '@theme-original/BlogListPaginator';
import Callout from '@site/src/components/blog/Callout';

export default function BlogListPaginatorWrapper(props) {
  return (
    <>
      <BlogListPaginator {...props} />
      <Callout />
    </>
  );
}
