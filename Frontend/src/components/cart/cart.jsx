import React from "react";
import Star from "../../components/icons/startRating";
import ms from "ms";
import { GiStairs } from "react-icons/gi";
import { MdOutlineAccessTime } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";

const Cart = ({
  id,
  title,
  desc,
  thumbnail,
  rating,
  level,
  students,
  duration,
  instructor,
  instructorPic,
  onClickFunc,
}) => {
  return (
    <div
      className="flex mt-4 w-[80vw] m-[auto] shadow-lg cursor-pointer rounded-md"
      onClick={() => onClickFunc(id)}
    >
      <div className="ml-4 w-[25%]">
        <img src={thumbnail} className="w-[300px] h-[150px] object-cover" />
      </div>
      <div className="ml-4 w-[58%] pr-2">
        <h2 className="text-[1.5em] font-semibold">{title}</h2>
        <p className="text-gray-600 text-sm">{desc}</p>
        <Star rating={rating} size={"20px"} />
        <div className="flex items-center my-2">
          <img
            src={instructorPic}
            className="h-[25px] w-[25px] object-cover rounded-full"
          />
          <span className="text-gray-500 text-sm">{instructor}</span>
        </div>
      </div>
      <div className="border-l-2 pl-4 flex items-center">
        <div>
          <p>
            <GiStairs className="text-xl inline-block mr-2" /> {level}
          </p>
          <p>
            <PiStudentFill className="text-xl inline-block mr-3" />
            {students} Enrolled
          </p>
          <p>
            <MdOutlineAccessTime className="text-xl inline-block mr-2" />{" "}
            {ms(duration * 1000, { long: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
