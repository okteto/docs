// Signup to the product updates email on the release notes, in every version
// of the docs: on top of the right column (ProductUpdatesAside, from
// src/theme/DocItem/TOC/Desktop) and, on narrow screens, where that column is
// hidden, in a box between the title and the first release (the default
// export, from src/theme/DocItem/Content).

import React from 'react';

import { NEWSLETTERS, NewsletterForm } from '@site/src/components/Newsletter';
import styles from './styles.module.scss';

const { formId, title, text } = NEWSLETTERS.productUpdates;

export function ProductUpdatesAside() {
  if (!formId) {
    return null;
  }

  return (
    <div className={styles.aside}>
      <p className={styles.asideTitle}>{title}</p>
      <NewsletterForm list="productUpdates" instance="release-notes-aside" variant="column" />
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
