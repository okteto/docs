// Remembers the page a visitor is on and the one before it, for the forms of
// okteto.com (Get a demo, Start for Free): their hidden `source_page` field
// gets the page the visitor came from, also when that page is in the docs, the
// tutorials or the blog. The four sites share the origin, so they share
// sessionStorage, and okteto.com reads the same keys
// (src/utils/formSource.js in okteto/website).

const CURRENT = 'okteto:current-page';
const PREVIOUS = 'okteto:previous-page';

export function onRouteDidUpdate({ location }) {
  try {
    const url = `${window.location.origin}${location.pathname}${location.search}`;
    const current = window.sessionStorage.getItem(CURRENT);
    if (current && current !== url) window.sessionStorage.setItem(PREVIOUS, current);
    window.sessionStorage.setItem(CURRENT, url);
  } catch {
    // Storage blocked or full: the forms fall back to the referrer.
  }
}
