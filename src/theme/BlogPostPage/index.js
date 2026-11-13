// Swizzled (ejected): the right column of a post stays in view and holds, in
// this order, the tags and the edit link (which the stock theme puts in the
// post footer), the table of contents and the newsletter signup. On narrow
// screens the column drops below the post, without the table of contents or
// the signup (the callout above it has one).

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
import EditThisPage from '@theme/EditThisPage';
import TagsListInline from '@theme/TagsListInline';

import { NewsletterForm } from '@site/src/components/blog/Callout/Newsletter';
import styles from './styles.module.scss';

function Aside() {
  const { metadata, toc } = useBlogPost();
  const { tags, editUrl, frontMatter } = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;
  const showToc = !hideTableOfContents && toc.length > 0;

  return (
    <aside className={styles.aside}>
      {(tags.length > 0 || editUrl) && (
        <div className={styles.meta}>
          {tags.length > 0 && <TagsListInline tags={tags} />}
          {editUrl && <EditThisPage editUrl={editUrl} />}
        </div>
      )}
      {showToc && (
        <TOC toc={toc} minHeadingLevel={tocMinHeadingLevel} maxHeadingLevel={tocMaxHeadingLevel} className={styles.toc} />
      )}
      <div className={styles.newsletter}>
        <p className={styles.newsletterTitle}>Subscribe to our newsletter</p>
        <NewsletterForm instance="aside" className={styles.newsletterForm} />
      </div>
    </aside>
  );
}

function BlogPostPageContent({ sidebar, children }) {
  const { metadata } = useBlogPost();

  return (
    <BlogLayout sidebar={sidebar} toc={<Aside />}>
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
