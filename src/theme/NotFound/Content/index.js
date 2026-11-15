// Swizzled (wrapped): a page not found sends `404 Page Viewed` to Mixpanel,
// the event okteto.com sends for its own 404 page.

import React, { useEffect } from 'react';
import Content from '@theme-original/NotFound/Content';

import { track } from '@site/src/clientModules/mixpanel';

export default function ContentWrapper(props) {
  useEffect(() => {
    track('404 Page Viewed', { path: window.location.pathname });
  }, []);
  return <Content {...props} />;
}
