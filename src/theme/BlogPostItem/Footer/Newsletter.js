// Newsletter signup shown at the end of every blog post. Embeds the same
// HubSpot form as the footer of okteto.com.

import React, { useEffect, useRef } from 'react';

import styles from './styles.module.scss';

const PORTAL_ID = '5418301';
const FORM_ID = '832002da-f018-426d-8b6f-45ac98caaf06';
const TARGET_ID = 'newsletter-form';
const EMBED_SRC = 'https://js.hsforms.net/forms/embed/v2.js';

function loadEmbedScript() {
  if (window.hbspt) {
    return Promise.resolve();
  }
  let script = document.querySelector(`script[src="${EMBED_SRC}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = EMBED_SRC;
    script.async = true;
    document.body.appendChild(script);
  }
  return new Promise((resolve, reject) => {
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
  });
}

export default function Newsletter() {
  const container = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadEmbedScript()
      .then(() => {
        if (cancelled || !container.current || !window.hbspt) {
          return;
        }
        container.current.innerHTML = '';
        window.hbspt.forms.create({
          portalId: PORTAL_ID,
          formId: FORM_ID,
          target: `#${TARGET_ID}`,
          css: '',
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className={styles.newsletter}>
      <p className={styles.newsletterTitle}>Subscribe to our newsletter</p>
      <p className={styles.newsletterText}>Get new posts about Kubernetes, platform engineering, and AI agents in your inbox.</p>
      <div id={TARGET_ID} ref={container} className={styles.newsletterForm} />
    </section>
  );
}
