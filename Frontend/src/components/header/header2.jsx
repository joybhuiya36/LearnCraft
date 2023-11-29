import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import CartIcon from "../icons/cartIcon";
import { useSelector } from "react-redux";

const Header2 = () => {
  const role = useSelector((state) => state.user.role);

  return (
    <div className="flex bg-[#00203c] pr-[5vw]">
      <div className="flex-grow"></div>
      <div className="flex gap-8">
        <Link to="/" className="text-[1.7em] text-white flex items-center">
          <AiOutlineHome />
        </Link>
        <Link
          to="/course"
          className="text-white leading-[4em] text-[.9em] font-semibold"
        >
          All Courses
        </Link>
        <Link
          to="/about"
          className="text-white leading-[4em] text-[.9em] font-semibold"
        >
          About Us
        </Link>
        {role && (
          <Link
            to="/dashboard"
            className="flex items-center text-2xl text-white"
          >
            <RxDashboard />
          </Link>
        )}

        {role == 3 && (
          <Link
            to="/wishlist"
            className="text-[1.7em] text-white flex items-center"
          >
            <MdFavorite />
          </Link>
        )}
        {role == 3 && (
          <Link
            to="/cart"
            className="text-[1.7em] text-white flex items-center"
          >
            <CartIcon />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header2;
