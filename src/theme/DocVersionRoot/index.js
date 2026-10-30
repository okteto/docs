import React from 'react';
import Head from '@docusaurus/Head';
import DocVersionRoot from '@theme-original/DocVersionRoot';

/**
 Wraps the original DocVersionRoot to mark every version other than the
 official one (archived versions and the unreleased one) as noindex, so search
 engines and AI crawlers cite the current docs. It sits at the version root so
 it covers doc pages and generated category index pages alike. The pages stay
 reachable from the version dropdown and the archives page, and the sitemap
 plugin drops noindex routes on its own.

 scripts/generate-noindex-headers.js does the same for the non-HTML files of
 those versions (Markdown twins, llms.txt).
*/
export default function DocVersionRootWrapper(props) {
  return (
    <>
      {!props.version.isLast && (
        <Head>
          <meta name="robots" content="noindex, follow" />
        </Head>
      )}
      <DocVersionRoot {...props} />
    </>
  );
}
