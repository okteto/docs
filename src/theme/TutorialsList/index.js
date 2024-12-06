import React from 'react';
import { useDocById, useActiveDocContext } from '@docusaurus/plugin-content-docs/client';

import Card from '../Card';

function TutorialsList(props) {
  const { activeVersion } = useActiveDocContext();

  console.log(activeVersion);

  const tutorials = activeVersion.docs.filter((doc) => props.tutorials.includes(doc.id));

  const orderedTutorials = props.tutorials
    .map((tutorialPath) => tutorials.find((doc) => doc.id === tutorialPath))
    .filter(Boolean); // Remove any undefined entries if a tutorial path is not found

  return (
    <>
      {orderedTutorials?.length > 0 && (
        <div style={{ display: 'flex', gap: '2em' }}>
          {orderedTutorials.map((tutorial) => {
            const data = useDocById(tutorial.id);
            const path = activeVersion.path;
            return (
              <Card title={data.title} url={`${path}/${tutorial.id}`} key={tutorial.id}>
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
