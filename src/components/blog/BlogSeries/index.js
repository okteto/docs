// "Part N of <series>" box shown on posts that have `series:` in their front
// matter. Posts are ordered by date (see src/plugins/okteto-blog).

import React from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';

import styles from './styles.module.scss';

export default function BlogSeries() {
  const { metadata, frontMatter } = useBlogPost();
  const { series } = usePluginData('docusaurus-plugin-content-blog');
  const posts = frontMatter.series ? series[frontMatter.series] : null;
  if (!posts || posts.length < 2) return null;

  const position = posts.findIndex((p) => p.permalink === metadata.permalink) + 1;
  return (
    <details className={styles.series}>
      <summary>
        Part {position} of {posts.length} in the <strong>{frontMatter.series}</strong> series
      </summary>
      <ol>
        {posts.map((post) => (
          <li key={post.permalink}>
            {post.permalink === metadata.permalink ? post.title : <Link to={post.permalink}>{post.title}</Link>}
          </li>
        ))}
      </ol>
    </details>
  );
}
