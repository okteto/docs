import React from "react";

import "./styles.scss";

function TiersList({tiers}) {

  const tiersArray = tiers.split(" ");

  console.log(tiersArray);
  return (
    <div className="TiersList">
    {tiersArray.map(tier => (
      <span className="Tier">{tier}</span>
    ))}
    </div>
  );
}

export default TiersList;
