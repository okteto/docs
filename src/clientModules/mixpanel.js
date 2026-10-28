import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import mixpanel from 'mixpanel-browser';

// Mixpanel analytics for the docs and the blog (registered in config/shared.js),
// sent to the "Website" project. The project token is public by design: it
// ships in the browser bundle and only allows sending events, not reading them.
const MIXPANEL_TOKEN = 'e6c01eb25bd30eb856ae639a17121d8e';

// Only production traffic is tracked, so local builds and Netlify deploy
// previews don't end up in the reports.
const TRACKED_HOST = 'www.okteto.com';

if (
  ExecutionEnvironment.canUseDOM &&
  MIXPANEL_TOKEN &&
  window.location.hostname === TRACKED_HOST
) {
  mixpanel.init(MIXPANEL_TOKEN, {
    // Docusaurus routes client-side, so page views are tracked on every path
    // change instead of only on full page loads.
    track_pageview: 'url-with-path',
    autocapture: true,
  });
}
