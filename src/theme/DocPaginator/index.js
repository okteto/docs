import React from 'react';
import DocPaginator from '@theme-original/DocPaginator';

import Feedback from '../../components/Feedback'

export default function DocPaginatorWrapper(props) {
  return (
    <>
      <DocPaginator {...props} />
      <Feedback />
    </>
  );
}
