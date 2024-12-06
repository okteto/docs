import React from 'react';
import {
  useDocById,
  useActiveDocContext,
  useCurrentSidebarCategory,
} from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Card from '../Card';

import './styles.scss';

function TutorialsList(props) {
  const { activeVersion } = useActiveDocContext();

  const sidebarData = useCurrentSidebarCategory();

  const tutorialsList = sidebarData.items.map((doc) => doc.docId);

  const tutorials = activeVersion.docs.filter((doc) => tutorialsList.includes(doc.id));

  const orderedTutorials = tutorialsList
    .map((tutorialPath) => tutorials.find((doc) => doc.id === tutorialPath))
    .filter(Boolean);

  return (
    <>
      {orderedTutorials?.length > 0 && (
        <div className="TutorialsListGrid">
          {orderedTutorials.map((tutorial) => {
            const data = useDocById(tutorial.id);
            console.log(data);
            const path = activeVersion.path;
            return (
              <Card
                title={data.title}
                url={`${path}/${tutorial.id}`}
                logo={tutorial.logo && useBaseUrl(`/img/logos/${tutorial.logo}`)}
                key={tutorial.id}
              >
                {data.description}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

export default TutorialsList;
