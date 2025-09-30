import React from 'react';
import Link from '@docusaurus/Link';

import './styles.scss';

const Card = ({ title, url, logo, children }) => {
  return (
    <div className="Card">
      {url && <Link to={url} className="CardLink"></Link>}
      <div className="CardTitle">{title}</div>
      {children}
      {logo && (
        <div className="CardLogos">
          <img src={logo} width="32" height="32" />
        </div>
      )}
    </div>
  );
};

export default Card;
