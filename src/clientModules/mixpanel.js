import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import mixpanel from 'mixpanel-browser';

// Mixpanel analytics for the docs, the tutorials and the blog (registered in
// config/shared.js), sent to the "Website" project, like okteto.com
// (src/utils/analytics.js in okteto/website). The project token is public by
// design: it ships in the browser bundle and only allows sending events, not
// reading them.
const MIXPANEL_TOKEN = 'e6c01eb25bd30eb856ae639a17121d8e';

// Only production traffic is tracked, so local builds and Netlify deploy
// previews don't end up in the reports.
const TRACKED_HOST = 'www.okteto.com';

let enabled = false;

// Automated browsers (headless Chrome, Playwright, Selenium) say so in
// navigator.webdriver. Crawlers driving them were most of the page views in
// the reports, one page per visitor, so they aren't tracked.
if (
  ExecutionEnvironment.canUseDOM &&
  window.location.hostname === TRACKED_HOST &&
  !window.navigator.webdriver
) {
  mixpanel.init(MIXPANEL_TOKEN, {
    // Docusaurus routes client-side, so page views are tracked on every path
    // change instead of only on full page loads.
    track_pageview: 'url-with-path',
    autocapture: true,
  });
  // `?analytics=off` on any page stops tracking this browser, for the team,
  // so our own visits don't end up in the reports; `?analytics=on` undoes
  // it. Mixpanel keeps the choice in localStorage, per project token, so it
  // applies to okteto.com too (src/utils/analytics.js in okteto/website).
  const choice = new URLSearchParams(window.location.search).get('analytics');
  if (choice === 'off') mixpanel.opt_out_tracking();
  if (choice === 'on') mixpanel.opt_in_tracking();
  enabled = true;

  // Calls to action (the Button component, which the blog's CallToAction and
  // the end-of-post callout use, and the Get Started button of the navbar)
  // send `Click <label>`, the event name okteto.com sends for its buttons, so
  // one report covers the clicks on the website, the docs, the tutorials and
  // the blog.
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest?.('a.Button');
      const label = link?.textContent.trim();
      // sendBeacon: the click usually leaves the page, which would cancel a
      // regular request.
      if (label) track(`Click ${label}`, { url: link.href }, { transport: 'sendBeacon' });
    },
    { capture: true },
  );
}

export function track(event, properties, options) {
  if (enabled) mixpanel.track(event, properties, options);
}
