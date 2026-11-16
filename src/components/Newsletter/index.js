// Signup forms of the two email lists, embedded from HubSpot:
//
// - blog: the newsletter with the blog posts, the same form as the footer of
//   okteto.com. The blog shows it.
// - productUpdates: an email with each Okteto release and the new tutorials.
//   The tutorials and the docs show it.
//
// A site picks its list with `customFields.newsletter` in its Docusaurus
// config (useSiteNewsletter); without it, the list is `blog`.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { track } from '@site/src/clientModules/mixpanel';

import styles from './styles.module.scss';

const PORTAL_ID = '5418301';
const PRIVACY_POLICY_URL = 'https://www.okteto.com/privacy-policy/';
const REGION = 'na2';

export const NEWSLETTERS = {
  blog: {
    formId: '832002da-f018-426d-8b6f-45ac98caaf06',
    title: 'Subscribe to our newsletter',
    text: 'What we learn running development environments and coding agents on Kubernetes, in your inbox.',
  },
  productUpdates: {
    formId: '039cebe7-f47a-417b-a728-8e92474852ec',
    title: 'Get product updates',
    text: 'An email with each Okteto release and the new tutorials.',
  },
};

export function useSiteNewsletter() {
  const { siteConfig } = useDocusaurusContext();
  return siteConfig.customFields?.newsletter ?? 'blog';
}
const EMBED_SRC = 'https://js.hsforms.net/forms/embed/v2.js';
const LOAD_TIMEOUT_MS = 15000;

const hubspotFormsReady = () => typeof window.hbspt?.forms?.create === 'function';

// Loads the HubSpot embed script. A script that failed to load is removed so
// that a retry injects a fresh one instead of waiting on an event that already
// fired.
function loadEmbedScript() {
  if (hubspotFormsReady()) {
    return Promise.resolve();
  }

  const existing = document.querySelector(`script[src="${EMBED_SRC}"]`);
  if (existing?.dataset.state === 'error') {
    existing.remove();
  }

  let script = document.querySelector(`script[src="${EMBED_SRC}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = EMBED_SRC;
    script.async = true;
    script.dataset.state = 'loading';
    script.addEventListener('load', () => (script.dataset.state = 'loaded'), { once: true });
    script.addEventListener('error', () => (script.dataset.state = 'error'), { once: true });
    document.body.appendChild(script);
  }

  if (script.dataset.state === 'loaded') {
    return hubspotFormsReady() ? Promise.resolve() : Promise.reject(new Error('HubSpot forms API unavailable'));
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      script.dataset.state = 'error';
      reject(new Error('HubSpot embed script timed out'));
    }, LOAD_TIMEOUT_MS);
    script.addEventListener(
      'load',
      () => {
        clearTimeout(timer);
        hubspotFormsReady() ? resolve() : reject(new Error('HubSpot forms API unavailable'));
      },
      { once: true },
    );
    script.addEventListener(
      'error',
      () => {
        clearTimeout(timer);
        reject(new Error('HubSpot embed script failed to load'));
      },
      { once: true },
    );
  });
}

// Every form ends with the same consent text, in two lines, under the button.
// The consent text of the HubSpot form itself is hidden, so that the forms
// without one show it too.
//
// `list` is a key of NEWSLETTERS. `instance` tells apart the copies of the form
// on one page: it names the element HubSpot renders into and the form instance.
// `variant` is `callout` (on the dark callout), `page` (on the page background)
// or `column` (on the page background, in a narrow column).
export function NewsletterForm({ list, instance = 'callout', variant = 'callout', className }) {
  const { formId } = NEWSLETTERS[list];
  const targetId = `newsletter-form-${instance}`;
  const container = useRef(null);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!formId) {
      return undefined;
    }
    let cancelled = false;
    setStatus('loading');

    loadEmbedScript()
      .then(() => {
        if (cancelled || !container.current) {
          return;
        }
        container.current.innerHTML = '';
        window.hbspt.forms.create({
          region: REGION,
          portalId: PORTAL_ID,
          formId,
          formInstanceId: instance,
          target: `#${targetId}`,
          css: '',
          // In a narrow column, the placeholder of the form doesn't fit.
          onFormReady: () => {
            const email = container.current?.querySelector('input[type="email"]');
            if (variant === 'column' && email) {
              email.placeholder = 'Your email';
            }
          },
          onFormSubmitted: () => track('Newsletter Subscribed', { form: instance, list }),
        });
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, formId, instance, list, targetId, variant]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  if (!formId) {
    return null;
  }

  return (
    <>
      <div
        id={targetId}
        ref={container}
        className={`${styles.newsletterForm} ${styles[variant] || ''} ${className || ''}`}
        hidden={status === 'error'}
      />
      {status !== 'error' && (
        <p className={styles.consent}>
          You can unsubscribe at any time.
          <br />
          See our{' '}
          <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener">
            Privacy Policy
          </a>
          .
        </p>
      )}
      {status === 'error' && (
        <p className={styles.newsletterError} role="alert">
          The signup form couldn't load.{' '}
          <button type="button" className={styles.newsletterRetry} onClick={retry}>
            Try again
          </button>
        </p>
      )}
    </>
  );
}
