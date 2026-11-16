// Callout shown at the end of every post and below every post list, on the blog
// and on the tutorials: the signup of the site's email list. The calls to action
// of the product (Get a demo, Start for Free) are in the navbar.

import React from 'react';

import { NEWSLETTERS, NewsletterForm, useSiteNewsletter } from '@site/src/components/Newsletter';
import styles from './styles.module.scss';

export default function Callout() {
  const list = useSiteNewsletter();
  const { formId, title, text } = NEWSLETTERS[list];

  if (!formId) {
    return null;
  }

  return (
    <section className={styles.callout}>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
      <NewsletterForm list={list} />
    </section>
  );
}
