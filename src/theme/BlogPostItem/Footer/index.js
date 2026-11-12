// Swizzled (wrapped): on post pages, adds the callout (the newsletter signup
// and what Okteto is) above the stock footer (tags and edit link).

import React from 'react';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Footer from '@theme-original/BlogPostItem/Footer';

import Callout from '@site/src/components/blog/Callout';

export default function FooterWrapper(props) {
  const { isBlogPostPage } = useBlogPost();

  return (
    <>
      {isBlogPostPage && <Callout />}
      <Footer {...props} />
    </>
  );
}
