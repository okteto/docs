// Swizzled (wrapped): the release notes, in every version of the docs, start
// with the signup to the product updates email, between the title and the
// first release.

import React from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Content from '@theme-original/DocItem/Content';

import ProductUpdatesSignup from '@site/src/components/ProductUpdatesSignup';

export default function ContentWrapper({ children, ...props }) {
  const { metadata } = useDoc();

  if (metadata.id !== 'release-notes') {
    return <Content {...props}>{children}</Content>;
  }

  return (
    <Content {...props}>
      <ProductUpdatesSignup />
      {children}
    </Content>
  );
}
