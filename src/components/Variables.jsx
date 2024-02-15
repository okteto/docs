import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Variables = ({ render }) => {
  const {
    siteConfig: {customFields},
  } = useDocusaurusContext();

  return (
    <>
      {render(customFields)}
    </>
  )
}

export default Variables;
