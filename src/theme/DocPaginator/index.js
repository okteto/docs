import React from 'react';
import DocPaginator from '@theme-original/DocPaginator';

import BrowserOnly from '@docusaurus/BrowserOnly';
import Feedback from '../../components/Feedback'

export default function DocPaginatorWrapper(props) {
  return (
    <>
      <BrowserOnly>
        {() => <Feedback />}
      </BrowserOnly>
      <DocPaginator {...props} />
    </>
  );
}
