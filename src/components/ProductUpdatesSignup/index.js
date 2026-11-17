// Signup to the product updates email in the docs, in every version, on top of
// the right column of every page (from src/theme/DocItem/TOC/Desktop). On
// narrow screens, where that column is hidden, the signup is in the footer
// (src/theme/Footer/Layout).

import React from 'react';

import { NEWSLETTERS, NewsletterForm } from '@site/src/components/Newsletter';
import styles from './styles.module.scss';

const { formId, title } = NEWSLETTERS.productUpdates;

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
