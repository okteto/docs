// Swizzled (wrapped): adds the featured image and the series navigation below
// the stock post header, and the per-post social card override.

import React from 'react';
import Head from '@docusaurus/Head';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Header from '@theme-original/BlogPostItem/Header';
import BlogSeries from '@site/src/components/blog/BlogSeries';

import styles from './styles.module.scss';

export default function HeaderWrapper(props) {
  const { frontMatter, assets, isBlogPostPage } = useBlogPost();
  const { withBaseUrl } = useBaseUrlUtils();
  if (!isBlogPostPage) return <Header {...props} />;

  const image = assets.image ?? frontMatter.image;
  const socialImage = frontMatter.social_image && withBaseUrl(frontMatter.social_image, { absolute: true });

  return (
    <>
      {socialImage && (
        <Head>
          <meta property="og:image" content={socialImage} />
          <meta name="twitter:image" content={socialImage} />
        </Head>
      )}
      <Header {...props} />
      {image && !frontMatter.hide_featured_image && (
        <img className={styles.featured} src={image} alt={frontMatter.image_alt || ''} />
      )}
      <BlogSeries />
    </>
  );
}
