// Swizzled (wrapped): a post page ends with the callout (the newsletter signup
// and what Okteto is). Its tags and edit link, which the stock footer shows,
// are in the right column instead (see src/theme/BlogPostPage).

import React from 'react';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Footer from '@theme-original/BlogPostItem/Footer';

import Callout from '@site/src/components/blog/Callout';

export default function FooterWrapper(props) {
  const { isBlogPostPage } = useBlogPost();

  return isBlogPostPage ? <Callout /> : <Footer {...props} />;
}
