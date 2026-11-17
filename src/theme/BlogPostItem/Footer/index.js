// Swizzled (wrapped): a post page ends with its text, without the stock footer
// (tags and edit link). The signup is in the right column (see
// src/theme/BlogPostPage).

import React from 'react';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Footer from '@theme-original/BlogPostItem/Footer';

export default function FooterWrapper(props) {
  const { isBlogPostPage } = useBlogPost();

  return isBlogPostPage ? null : <Footer {...props} />;
}
