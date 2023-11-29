import React, { useState } from "react";
import StarRatings from "react-star-ratings";

const Star = ({ rating, size }) => {
  return (
    <StarRatings
      rating={rating}
      starRatedColor="#0689b6"
      numberOfStars={5}
      name="rating"
      starDimension={size}
      starSpacing="1px"
    />
  );
};

export default Star;
