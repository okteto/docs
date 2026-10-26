// Swizzled (ejected): the blog index, tag and author pages show a grid of
// post cards instead of the stock list of truncated posts, matching the
// layout of the Sanity-powered blog.

import React from 'react';
import Link from '@docusaurus/Link';

import styles from './styles.module.scss';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

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
            <span>
              {author?.name && <strong>{author.name}</strong>}
              <time dateTime={metadata.date}>{formatDate(metadata.date)}</time>
            </span>
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
