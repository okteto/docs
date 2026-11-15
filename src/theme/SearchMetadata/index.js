// Swizzled (wrapped): on a site that sets `customFields.searchTag` (the
// tutorials), every page is indexed with that tag instead of the stock one
// (`default`, or `blog_posts_list` and the like on list pages), so its search
// box can return its pages only (see `algolia` in docusaurus.tutorials.config.js).

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SearchMetadata from '@theme-original/SearchMetadata';

export default function SearchMetadataWrapper(props) {
  const { siteConfig } = useDocusaurusContext();
  const tag = siteConfig.customFields?.searchTag;
  return <SearchMetadata {...props} tag={tag ?? props.tag} />;
}
