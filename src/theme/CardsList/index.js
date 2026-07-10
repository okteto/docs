import React from 'react';
import { useDocsVersion, useCurrentSidebarCategory } from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Card from '../Card';

import './styles.scss';

function CardsList() {
  const category = useCurrentSidebarCategory();
  const { docs } = useDocsVersion();
  // Base URL of the logos folder, resolved once (hooks can't run inside the loop below).
  const logosBaseUrl = useBaseUrl('/img/logos/');

  return (
    <>
      {category.items?.length > 0 && (
        <div className="CardsListGrid">
          {category.items.map((item) => {
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
      )}
    </>
  );
}

export default CardsList;
