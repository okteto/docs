import React from 'react';

import './styles.scss';

const Button = ({ children, role, to, external, className, onClick, size }) => {
  if (role === 'button') {
    return (
      <div
        onClick={onClick}
        className={`Button ${className || ''} layout ${size || ''}`}
      >
        { children }
      </div>
    );
  } else {
    return <a
        onClick={onClick}
        className={`Button ${className || ''} layout ${size || ''}`}
        href={to}
        target={external ? '_blank' : '_self'}>
      { children }
    </a>;
  }
};

export default Button;