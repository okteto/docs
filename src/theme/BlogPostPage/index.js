// Swizzled (ejected): the right column of a post stays in view and holds the
// table of contents, the product calls to action with a link to the newsletter
// signup at the end of the post, and the tags and the edit link, which the
// stock theme puts in the post footer. On narrow screens the column drops
// below the post, without the calls to action (the callout above it has them).

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
import Button from '@theme/Button';

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
      {showToc && (
        <TOC toc={toc} minHeadingLevel={tocMinHeadingLevel} maxHeadingLevel={tocMaxHeadingLevel} className={styles.toc} />
      )}
      <div className={styles.cta}>
        <Button to="https://www.okteto.com/get-demo/" className="teal" size="small">
          Get a demo
        </Button>
        <Button to="https://www.okteto.com/signup/" className="light" size="small">
          Start for Free
        </Button>
        <a href="#newsletter">Subscribe to our newsletter</a>
      </div>
      {(tags.length > 0 || editUrl) && (
        <div className={styles.meta}>
          {tags.length > 0 && <TagsListInline tags={tags} />}
          {editUrl && <EditThisPage editUrl={editUrl} />}
        </div>
      )}
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
