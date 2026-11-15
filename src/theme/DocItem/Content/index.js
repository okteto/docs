// Swizzled (wrapped): on narrow screens, where the right column is hidden, the
// release notes start with the signup to the product updates email, between
// the title and the first release. On wide screens the signup is on top of the
// right column (src/theme/DocItem/TOC/Desktop).

import React from 'react';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Content from '@theme-original/DocItem/Content';

import ProductUpdatesSignup from '@site/src/components/ProductUpdatesSignup';

export default function ContentWrapper({ children, ...props }) {
  const { metadata } = useDoc();
  const windowSize = useWindowSize();

  if (metadata.id !== 'release-notes' || windowSize !== 'mobile') {
    return <Content {...props}>{children}</Content>;
  }

  return (
    <Content {...props}>
      <ProductUpdatesSignup />
      {children}
    </Content>
  );
}
