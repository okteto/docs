import React from 'react';

function Display(props) {
  const condition = props.if || false;
  return (
    <>
      {condition && props.children}
    </>
  );
}

export default Display;
