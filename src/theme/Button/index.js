import React from 'react';

import './styles.scss';

const Button = ({ children, role, to, external, className, onClick, size, hidden, type }) => {
  if (role === 'button') {
    return (
      <button
        onClick={onClick}
        className={`Button ${className || ''} layout ${size || ''}`}
        hidden={hidden}
        type={type || "button"}
      >
        { children }
      </button>
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