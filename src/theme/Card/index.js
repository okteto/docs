import React from 'react';
import Link from '@docusaurus/Link';

import './styles.scss';

const Card = ({ title, url, logos, children }) => {
  return (
    <div className="Card">
      {url && <Link to={url} className="CardLink"></Link>}
      <div className="CardTitle">{title}</div>
      {children}
      {logos?.length > 0 && (
        <div className="CardLogos">
          {logos.map((logo) => (
            <img src={logo} width="32" height="32" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;
