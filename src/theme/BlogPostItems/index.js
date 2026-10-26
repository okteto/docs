// Swizzled (ejected): the blog index, tag and author pages show a grid of
// post cards instead of the stock list of truncated posts, matching the
// layout of the Sanity-powered blog. Cards show no date: dates only order
// the posts (newest first).

import React from 'react';
import Link from '@docusaurus/Link';

import styles from './styles.module.scss';

function PostCard({ content }) {
  const { metadata, frontMatter, assets } = content;
  const image = assets?.image ?? frontMatter.image;
  const [author] = metadata.authors;
  return (
    <article className={styles.card}>
      <Link to={metadata.permalink} className={styles.cardLink}>
        <div className={styles.cardImage}>
          {image && <img src={image} alt={frontMatter.image_alt || ''} loading="lazy" />}
        </div>
        <div className={styles.cardBody}>
          <h2 className={styles.cardTitle}>{metadata.title}</h2>
          {(frontMatter.excerpt || metadata.description) && (
            <p className={styles.cardExcerpt}>{frontMatter.excerpt || metadata.description}</p>
          )}
          <div className={styles.cardMeta}>
            {author?.imageURL && <img src={author.imageURL} alt="" className={styles.avatar} />}
            {author?.name && <strong>{author.name}</strong>}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function BlogPostItems({ items }) {
  return (
    <div className={styles.grid}>
      {items.map(({ content }) => (
        <PostCard key={content.metadata.permalink} content={content} />
      ))}
    </div>
  );
}
