import React, { useMemo, useState } from 'react';
import { useDocsVersion, useCurrentSidebarCategory } from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Card from '../Card';

import './styles.scss';

/**
 * Cards for the items of the current sidebar category.
 *
 * Optional props, used by the tutorials index:
 *   searchPlaceholder: shows a search box that filters the cards by title and
 *                      description, with this placeholder.
 *   pageSize:          shows this many cards per page, with Previous / Next.
 */
function CardsList({ searchPlaceholder, pageSize }) {
  const category = useCurrentSidebarCategory();
  const { docs } = useDocsVersion();
  // Base URL of the logos folder, resolved once (hooks can't run inside the loop below).
  const logosBaseUrl = useBaseUrl('/img/logos/');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const items = category.items ?? [];
  const filtered = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return items;
    }
    return items.filter((item) => {
      const text = `${item.label} ${docs[item.docId]?.description ?? ''}`.toLowerCase();
      return words.every((word) => text.includes(word));
    });
  }, [items, docs, query]);

  const pages = pageSize ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
  const current = Math.min(page, pages - 1);
  const visible = pageSize ? filtered.slice(current * pageSize, (current + 1) * pageSize) : filtered;

  return (
    <>
      {searchPlaceholder && (
        <input
          type="search"
          className="CardsListSearch"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
        />
      )}
      {visible.length > 0 ? (
        <div className="CardsListGrid">
          {visible.map((item) => {
            /** The logo is opt-in per doc via front matter:
             *    sidebar_custom_props:
             *      logo: "aws"
             *  Docusaurus surfaces `sidebar_custom_props` as the sidebar item's
             *  `customProps`, so we read it here without any title-string hacks.
             *  Drop the matching `<name>.svg` in `static/img/logos/` to add one.
             **/
            const logo = item.customProps?.logo;

            return (
              <Card
                title={item.label}
                url={item.href}
                logo={logo ? `${logosBaseUrl}${logo}.svg` : null}
                key={item.docId}
              >
                {docs[item.docId]?.description}
              </Card>
            );
          })}
        </div>
      ) : (
        query && <p className="CardsListEmpty">Nothing matches “{query}”.</p>
      )}
      {pages > 1 && (
        <nav className="CardsListPagination" aria-label="Pages">
          <button
            type="button"
            className="button button--secondary"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </button>
          <span>
            Page {current + 1} of {pages}
          </span>
          <button
            type="button"
            className="button button--secondary"
            disabled={current === pages - 1}
            onClick={() => setPage(current + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}

export default CardsList;
