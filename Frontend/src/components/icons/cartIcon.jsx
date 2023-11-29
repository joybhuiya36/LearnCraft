import React, { useEffect, useState } from "react";
import { BsCart } from "react-icons/bs";
import { useSelector } from "react-redux";

const CartIcon = () => {
  const count = useSelector((state) => state.cartCount.count);
  return (
    <div className="relative">
      <BsCart className="text-white text-2xl cursor-pointer" />
      <span className="bg-red-500 rounded-full text-white text-xs px-[6px] py-[1px] text-center absolute right-[-12px] top-[-9px]">
        {count}
      </span>
    </div>
  );
};

export default CartIcon;
