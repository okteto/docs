import React from 'react';
import { useDocById, useCurrentSidebarCategory } from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Card from '../Card';

import './styles.scss';

function CardsList() {
  const category = useCurrentSidebarCategory();

  return (
    <>
      {category.items?.length > 0 && (
        <div className="CardsListGrid">
          {category.items.map((tutorial) => {
            const frontmatter = useDocById(tutorial.docId);

            /** Unfortunately, at the moment we don’t have access to custom frontmatter value
             *  Meaning, we can’t do something like `logo: "aws"`.
             *  We’ll check if the title string includes a keyword and include the logo in that case.
             **/
            return (
              <Card
                title={tutorial.label}
                url={tutorial.href}
                logos={findKeywordsInString(tutorial.label)}
                key={tutorial.docId}
              >
                {frontmatter.description}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

function findKeywordsInString(string) {
  const keywords = ['aws', 'docker', 'webpack', 'launchdarkly', 'okteto'];
  const foundKeywords = keywords.filter((keyword) =>
    string.toLowerCase().includes(keyword.toLowerCase())
  );

  return foundKeywords.map((keyword) => useBaseUrl(`/img/logos/${keyword}.svg`));
}

export default CardsList;
