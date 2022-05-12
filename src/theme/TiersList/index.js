import React from "react";
import PropTypes from 'prop-types';

import "./styles.scss";

const TiersList = ({tiers}) => {

  if(typeof tiers !== 'string') return null;

  const tiersArray = tiers.split(" ");

  return (
    <div className="TiersList">
      {tiersArray.length > 0 && tiersArray.map((tier, index) => (
        <span className="Tier" key={`${tier}-${index}`}>{tier}</span>
      ))}
    </div>
  );
}

TiersList.propTypes = {
  tiers: PropTypes.string.isRequired
};

export default TiersList;
