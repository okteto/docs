// Swizzled (wrapped): a post page ends without the stock footer (tags and edit
// link). On the blog, it ends with what Okteto is and a link to okteto.com
// (src/components/blog/AboutOkteto), inside the <article> of the post. The
// signup is in the right column (see src/theme/BlogPostPage).

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Footer from '@theme-original/BlogPostItem/Footer';

import AboutOkteto from '@site/src/components/blog/AboutOkteto';

export default function FooterWrapper(props) {
  const { isBlogPostPage } = useBlogPost();
  const { siteConfig } = useDocusaurusContext();

  if (!isBlogPostPage) return <Footer {...props} />;
  return siteConfig.customFields?.aboutOkteto ? <AboutOkteto /> : null;
}
