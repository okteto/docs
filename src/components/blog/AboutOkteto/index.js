// The last block of every blog post: what Okteto is, in one sentence, with a
// link to okteto.com. It's rendered inside the <article> of the post
// (src/theme/BlogPostItem/Footer), so readers, search and answer engines that
// land on a post about Kubernetes or agents also read who publishes it and
// what the product does. The site turns it on with `customFields.aboutOkteto`
// (the blog does, the tutorials don't).
//
// The text is the same on every post, and it's about one thing: ephemeral
// environments on Kubernetes for coding agents, developers, and pull requests.
// It doesn't say that Okteto runs the agents. Keep it in line with the
// application environments page of okteto.com
// (/kubernetes-application-environments/).

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { track } from '@site/src/clientModules/mixpanel';
import styles from './styles.module.scss';

export default function AboutOkteto() {
  const { siteConfig } = useDocusaurusContext();
  const url = `${siteConfig.url}/`;

  return (
    <aside className={styles.about} aria-label="About Okteto">
      <p className={styles.title}>About Okteto</p>
      <p>
        {/* A named event, like the calls to action: the logo of the navbar
            links to the home page too, so the referrer alone doesn't tell
            the clicks on this link apart. */}
        <a href={url} onClick={() => track('Click About Okteto', { url }, { transport: 'sendBeacon' })}>
          Okteto
        </a>{' '}
        is a Self-Hosted platform that gives coding agents, developers, and pull requests ephemeral environments on
        Kubernetes.
      </p>
    </aside>
  );
}
