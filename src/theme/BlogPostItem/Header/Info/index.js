// Swizzled (ejected): the line under a post's title shows the reading time
// only. The blog doesn't publish post dates; `date` front matter is used for
// ordering, the feed and search-engine metadata.

import React from 'react';
import clsx from 'clsx';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';

export default function BlogPostItemHeaderInfo({ className }) {
  const { readingTime } = useBlogPost().metadata;
  if (typeof readingTime === 'undefined') return null;
  const minutes = Math.max(1, Math.ceil(readingTime));
  return <div className={clsx('margin-vert--md', className)}>{minutes} min read</div>;
}
