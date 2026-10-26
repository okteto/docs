// Swizzled (wrapped): adds "Related content" below the stock footer (tags and
// edit link) on post pages.

import React from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Footer from '@theme-original/BlogPostItem/Footer';

import styles from './styles.module.scss';

export default function FooterWrapper(props) {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { posts } = usePluginData('docusaurus-plugin-content-blog');
  const related = isBlogPostPage ? posts[metadata.permalink]?.related ?? [] : [];

  return (
    <>
      <Footer {...props} />
      {related.length > 0 && (
        <section className={styles.related}>
          <h2>Related content</h2>
          <div className={styles.relatedGrid}>
            {related.map((post) => (
              <Link key={post.permalink} to={post.permalink} className={styles.relatedCard}>
                <strong>{post.title}</strong>
                {post.description && <span>{post.description}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
