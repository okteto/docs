// Callout shown at the end of every post and below every post list, on the blog
// and on the tutorials: the signup of the site's email list first, next to what
// Okteto is with the two product calls to action. Each half asks for one thing.

import React from 'react';
import Button from '@theme/Button';

import { NEWSLETTERS, NewsletterForm, useSiteNewsletter } from '@site/src/components/Newsletter';
import styles from './styles.module.scss';

function Newsletter() {
  const list = useSiteNewsletter();
  const { formId, title, text } = NEWSLETTERS[list];

  if (!formId) {
    return null;
  }

  return (
    <div className={styles.half}>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
      <NewsletterForm list={list} />
    </div>
  );
}

export default function Callout() {
  return (
    <section className={styles.callout}>
      <Newsletter />
      <div className={styles.half}>
        <p className={styles.title}>About Okteto</p>
        <p className={styles.text}>
          <a href="https://www.okteto.com/">Okteto</a> gives every developer, coding agent and pull request an
          on-demand environment on your Kubernetes.
        </p>
        <div className={styles.buttons}>
          <Button to="https://www.okteto.com/get-demo/" className="teal">
            Get a demo
          </Button>
          <Button to="https://www.okteto.com/signup/" className="light">
            Start for Free
          </Button>
        </div>
      </div>
    </section>
  );
}
