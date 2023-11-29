import React, { useState } from "react";
import StarRatings from "react-star-ratings";

const ChangableStar = ({ preRating, getRating }) => {
  const [rating, setRating] = useState(preRating);

  const handleChangeRating = (newRating) => {
    setRating(newRating);
    getRating(newRating);
  };

  return (
    <StarRatings
      changeRating={handleChangeRating}
      rating={rating}
      starRatedColor="#0689b6"
      numberOfStars={5}
      name="rating"
      starDimension="30px"
      starSpacing="1px"
      starHoverColor="#0689b6"
    />
  );
};

export default ChangableStar;
