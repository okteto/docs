import React from 'react';
import Link from '@docusaurus/Link';

import './styles.scss';

// A card with a title, a description and either a cover image on top, like
// the blog's post cards, or a small logo at the bottom.
const Card = ({ title, url, image, logo, children }) => {
  return (
    <div className={image ? 'Card CardWithImage' : 'Card'}>
      {url && <Link to={url} className="CardLink" aria-label={title}></Link>}
      {image && (
        <div className="CardImage">
          <img src={image} alt="" loading="lazy" width="1200" height="630" />
        </div>
      )}
      <div className="CardTitle">{title}</div>
      {children && <div className="CardExcerpt">{children}</div>}
      {logo && !image && (
        <div className="CardLogos">
          <img src={logo} width="32" height="32" alt={title || ""} />
        </div>
      )}
    </div>
  );
};

export default Card;
