// Components available to blog posts. Import the ones a post uses:
//
//   import { YouTube, CallToAction } from '@site/src/components/blog';
//
// Each one replaces a custom block type from the Sanity blog schema; the
// migration script (scripts/blog-migrate) emits them. blog/README.md has
// examples of each.

import React from 'react';
import clsx from 'clsx';
import Button from '@theme/Button';

import styles from './styles.module.scss';

// Image with a caption and/or float. A plain Markdown image covers the rest.
export function Figure({ src, alt = '', caption, float }) {
  return (
    <figure className={clsx(styles.figure, float && styles[`float-${float}`])}>
      <img src={src} alt={alt} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function YouTube({ id, title = 'YouTube video player' }) {
  return (
    <div className={styles.embed}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function Video({ src }) {
  const type = `video/${src.split('.').pop()}`;
  return (
    <video controls preload="metadata" className={styles.video}>
      <source src={src} type={type} />
    </video>
  );
}

// Twitter's iframe embed instead of its widget script, with do-not-track on.
export function Tweet({ id }) {
  return (
    <div className={styles.embed} data-tweet>
      <iframe
        src={`https://platform.twitter.com/embed/Tweet.html?id=${id}&dnt=true`}
        title="Post on X"
        loading="lazy"
      />
    </div>
  );
}

export function Arcade({ id }) {
  return (
    <div className={clsx(styles.embed, styles.arcade)}>
      <iframe src={`https://demo.arcade.software/${id}?embed`} title="Arcade demo" loading="lazy" allowFullScreen />
    </div>
  );
}

// `variant` matches the Sanity button themes: green, transparent, transparentteal.
export function BlogButton({ href, children, variant = 'green', arrow = false }) {
  const external = /^https?:\/\//.test(href) && !href.startsWith('https://www.okteto.com');
  return (
    <div className={styles.button}>
      <Button to={href} external={external} className={variant === 'green' ? 'teal' : 'light'}>
        {children}
        {arrow && ' →'}
      </Button>
    </div>
  );
}

export function CallToAction({ title, actions = [] }) {
  return (
    <section className={styles.cta}>
      <p className={styles.ctaTitle}>{title}</p>
      <div className={styles.ctaButtons}>
        {actions.map((action, index) => (
          <Button key={action.url} to={action.url} className={index === 0 ? 'teal' : 'light'}>
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}

export function CustomerQuote({ quote, author, role, image }) {
  return (
    <figure className={styles.quote}>
      <blockquote>{quote}</blockquote>
      {author && (
        <figcaption>
          {image && <img src={image} alt="" />}
          <span>
            <strong>{author}</strong>
            {role && <span>{role}</span>}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

export function Highlight({ children }) {
  return <aside className={styles.highlight}>{children}</aside>;
}

// Row of linked logos. Children are Markdown: [![Name](./logo.svg)](https://...)
export function Logos({ children }) {
  return <div className={styles.logos}>{children}</div>;
}
