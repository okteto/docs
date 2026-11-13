// Callout shown at the end of every blog post and below every post list: the
// newsletter signup first, since this is the blog, next to what Okteto is with
// the two product calls to action. Each half asks for one thing.

import React from 'react';
import Button from '@theme/Button';

import Newsletter from './Newsletter';
import styles from './styles.module.scss';

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
