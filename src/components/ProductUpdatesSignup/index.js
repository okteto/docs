// Signup to the product updates email in the docs, in every version: on top of
// the right column of every page (ProductUpdatesAside, from
// src/theme/DocItem/TOC/Desktop) and, on the release notes on narrow screens,
// where that column is hidden, in a box between the title and the first
// release (the default export, from src/theme/DocItem/Content).

import React from 'react';

import { NEWSLETTERS, NewsletterForm } from '@site/src/components/Newsletter';
import styles from './styles.module.scss';

const { formId, title, text } = NEWSLETTERS.productUpdates;

export function ProductUpdatesAside({ instance = 'docs-aside' }) {
  if (!formId) {
    return null;
  }

  return (
    <div className={styles.aside}>
      <p className={styles.asideTitle}>{title}</p>
      <NewsletterForm list="productUpdates" instance={instance} variant="column" />
    </div>
  );
}

export default function ProductUpdatesSignup() {
  if (!formId) {
    return null;
  }

  return (
    <section className={styles.signup}>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
      <NewsletterForm list="productUpdates" instance="release-notes" variant="page" />
    </section>
  );
}
