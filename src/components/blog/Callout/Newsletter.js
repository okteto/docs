// Newsletter signup, one half of the callout shown at the end of every blog
// post and post list. Embeds the same HubSpot form as the footer of okteto.com.

import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './styles.module.scss';

const PORTAL_ID = '5418301';
const FORM_ID = '832002da-f018-426d-8b6f-45ac98caaf06';
const TARGET_ID = 'newsletter-form';
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

export default function Newsletter() {
  const container = useRef(null);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    loadEmbedScript()
      .then(() => {
        if (cancelled || !container.current) {
          return;
        }
        container.current.innerHTML = '';
        window.hbspt.forms.create({
          portalId: PORTAL_ID,
          formId: FORM_ID,
          target: `#${TARGET_ID}`,
          css: '',
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
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return (
    <div className={styles.half}>
      <p className={styles.title}>Subscribe to our newsletter</p>
      <p className={styles.text}>Get new posts about Kubernetes, platform engineering, and AI agents in your inbox.</p>
      <div id={TARGET_ID} ref={container} className={styles.newsletterForm} hidden={status === 'error'} />
      {status === 'error' && (
        <p className={styles.newsletterError} role="alert">
          The signup form couldn't load.{' '}
          <button type="button" className={styles.newsletterRetry} onClick={retry}>
            Try again
          </button>
        </p>
      )}
    </div>
  );
}
