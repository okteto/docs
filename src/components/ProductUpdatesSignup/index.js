// Signup to the product updates email, shown at the top of the release notes
// in every version of the docs (src/theme/DocItem/Content).

import React from 'react';

import { NEWSLETTERS, NewsletterForm } from '@site/src/components/Newsletter';
import styles from './styles.module.scss';

export default function ProductUpdatesSignup() {
  const { formId, title, text } = NEWSLETTERS.productUpdates;

  if (!formId) {
    return null;
  }

  return (
    <section className={styles.signup}>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
      <NewsletterForm list="productUpdates" instance="release-notes" className={styles.form} />
    </section>
  );
}
