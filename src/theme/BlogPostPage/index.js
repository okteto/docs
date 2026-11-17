// Swizzled (ejected): the right column of a post (src/components/blog/Aside)
// holds the signup of the site's email list and, under it, the table of
// contents.

import React from 'react';
import clsx from 'clsx';
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import { BlogPostProvider, useBlogPost } from '@docusaurus/plugin-content-blog/client';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import BlogPostPageStructuredData from '@theme/BlogPostPage/StructuredData';
import TOC from '@theme/TOC';
import ContentVisibility from '@theme/ContentVisibility';

import Aside from '@site/src/components/blog/Aside';
import styles from './styles.module.scss';

function PostAside() {
  const { metadata, toc } = useBlogPost();
  const { frontMatter } = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;
  const showToc = !hideTableOfContents && toc.length > 0;

  return (
    <Aside>
      {showToc && (
        <TOC toc={toc} minHeadingLevel={tocMinHeadingLevel} maxHeadingLevel={tocMaxHeadingLevel} className={styles.toc} />
      )}
    </Aside>
  );
}

function BlogPostPageContent({ sidebar, children }) {
  const { metadata } = useBlogPost();

  return (
    <BlogLayout sidebar={sidebar} toc={<PostAside />}>
      <ContentVisibility metadata={metadata} />
      <BlogPostItem>{children}</BlogPostItem>
      <BlogPostPaginator />
    </BlogLayout>
  );
}

export default function BlogPostPage(props) {
  const BlogPostContent = props.content;
  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogPostPage)}>
        <BlogPostPageMetadata />
        <BlogPostPageStructuredData />
        <BlogPostPageContent sidebar={props.sidebar}>
          <BlogPostContent />
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
