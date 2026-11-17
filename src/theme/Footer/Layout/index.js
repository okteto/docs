// Swizzled (ejected): on narrow screens, where the right column with the signup
// is hidden, the footer of the docs, the blog, and the tutorials starts with
// the signup of the site's email list (product updates on the docs and the
// tutorials, the newsletter on the blog). The form is only rendered on narrow
// screens, so a page never has two copies of it.

import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames, useWindowSize } from '@docusaurus/theme-common';

import { NEWSLETTERS, NewsletterForm, useSiteNewsletter } from '@site/src/components/Newsletter';
import styles from './styles.module.scss';

function FooterSignup() {
  const windowSize = useWindowSize();
  const list = useSiteNewsletter();
  const { formId, title } = NEWSLETTERS[list];

  if (windowSize !== 'mobile' || !formId) {
    return null;
  }

  return (
    <div className={styles.signup}>
      <p className={styles.title}>{title}</p>
      <NewsletterForm list={list} instance="footer" variant="footer" />
    </div>
  );
}

export default function FooterLayout({ style, links, logo, copyright }) {
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid">
        <FooterSignup />
        {links}
        {(logo || copyright) && (
          <div className="footer__bottom text--center">
            {logo && <div className="margin-bottom--sm">{logo}</div>}
            {copyright}
          </div>
        )}
      </div>
    </footer>
  );
}
