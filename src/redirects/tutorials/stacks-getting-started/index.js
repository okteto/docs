import React from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function() {
  return <Redirect to={useBaseUrl('tutorials/compose-getting-started/')} />;
};
