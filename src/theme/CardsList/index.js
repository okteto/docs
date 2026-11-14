import React, { useState } from 'react';
import { useDocsVersion, useCurrentSidebarCategory } from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Card from '../Card';

import './styles.scss';

/**
 * Cards for the items of the current sidebar category.
 *
 * Optional prop, used by the tutorials index:
 *   pageSize: shows this many cards per page, with Previous / Next.
 */
function CardsList({ pageSize }) {
  const category = useCurrentSidebarCategory();
  const { docs } = useDocsVersion();
  // Base URLs resolved once (hooks can't run inside the loop below).
  const logosBaseUrl = useBaseUrl('/img/logos/');
  const siteBaseUrl = useBaseUrl('/');
  const [page, setPage] = useState(0);

  const items = category.items ?? [];
  const pages = pageSize ? Math.max(1, Math.ceil(items.length / pageSize)) : 1;
  const current = Math.min(page, pages - 1);
  const visible = pageSize ? items.slice(current * pageSize, (current + 1) * pageSize) : items;

  return (
    <>
      <div className="CardsListGrid">
        {visible.map((item) => {
          /** A cover image or a logo, opt-in per doc via front matter:
           *    sidebar_custom_props: { image: "/img/tutorials/covers/helm.jpg" }
           *    sidebar_custom_props: { logo: "aws" }
           *  Docusaurus surfaces `sidebar_custom_props` as the sidebar item's
           *  `customProps`. Logos are `<name>.svg` files in `static/img/logos/`;
           *  tutorial covers come from scripts/tutorial-covers.
           **/
          const logo = item.customProps?.logo;
          const image = item.customProps?.image;

          return (
            <Card
              title={item.label}
              url={item.href}
              logo={logo ? `${logosBaseUrl}${logo}.svg` : null}
              image={image ? `${siteBaseUrl}${image.replace(/^\//, '')}` : null}
              key={item.docId}
            >
              {docs[item.docId]?.description}
            </Card>
          );
        })}
      </div>
      {pages > 1 && (
        // Same markup as the blog's and the docs' Previous / Next links.
        <nav className="pagination-nav CardsListPagination" aria-label="Pages">
          {current > 0 && (
            <button
              type="button"
              className="pagination-nav__link pagination-nav__link--prev"
              onClick={() => setPage(current - 1)}
            >
              <div className="pagination-nav__sublabel">Previous</div>
              <div className="pagination-nav__label">Page {current}</div>
            </button>
          )}
          {current < pages - 1 && (
            <button
              type="button"
              className="pagination-nav__link pagination-nav__link--next"
              onClick={() => setPage(current + 1)}
            >
              <div className="pagination-nav__sublabel">Next</div>
              <div className="pagination-nav__label">Page {current + 2}</div>
            </button>
          )}
        </nav>
      )}
    </>
  );
}

export default CardsList;
