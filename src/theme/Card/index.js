import React from 'react';
import Link from '@docusaurus/Link';

import './styles.scss';

const Card = ({ title, url, children }) => {
  return (
    <div className="Card">
      {url && <Link to={url} className="CardLink"></Link>}
      <div className="CardTitle">{title}</div>
      {children}
    </div>
  );
};

export default Card;
