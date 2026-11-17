// Right column of the blog and the tutorials, on the posts and on the post
// lists: the signup of the site's email list on top and, on a post, its table
// of contents under it (the children). It stays in view, and a line on its
// left separates it from the page, as in the docs
// (src/theme/DocItem/TOC/Desktop). On narrow screens it is hidden.

import React from 'react';
import clsx from 'clsx';

import { NEWSLETTERS, NewsletterForm, useSiteNewsletter } from '@site/src/components/Newsletter';
import styles from './styles.module.scss';

export default function Aside({ children }) {
  const list = useSiteNewsletter();
  const { formId, title } = NEWSLETTERS[list];

  return (
    <aside className={clsx(styles.aside, !children && styles.full)}>
      {formId && (
        <div className={styles.newsletter}>
          <p className={styles.newsletterTitle}>{title}</p>
          <NewsletterForm list={list} instance="aside" variant="column" />
        </div>
      )}
      {children}
    </aside>
  );
}
