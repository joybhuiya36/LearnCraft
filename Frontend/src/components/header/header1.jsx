import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../redux/slices/userSlice";
import { searchword } from "../../redux/slices/searchSlice";
import { countZero } from "../../redux/slices/cartCountSlice";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

const Header1 = () => {
  const role = useSelector((state) => state.user.role);
  const [searchWord, setSearchWord] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(searchword(searchWord));
  }, [searchWord]);
  const handleLogout = () => {
    dispatch(userLogout());
    dispatch(countZero());
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged Out!");
  };
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center flex-1">
        <img src={logo} className="h-[60px] ml-12" />
        <p className="text-2xl font-bold ml-1 text-[#00203c]">LearnCraft</p>
      </div>
      <div className="flex items-center relative">
        <input
          type="text"
          onChange={(e) => setSearchWord(e.target.value)}
          value={searchWord}
          className="h-10 ml-4 w-[28vw] border-solid border-black outline outline-1"
        />
        <FaSearch className="text-2xl m-[-1.8em]" />
      </div>
      {role ? (
        <div className="flex-1 flex justify-end mr-6">
          <button
            className="text-white bg-[#0689b6] px-3 py-1.5 rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex-1 flex justify-end gap-[2vw] mr-[2vw]">
          <button
            className="text-white bg-[#0689b6] px-3 py-1.5 rounded-md"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="text-white bg-[#0689b6] px-3 py-1.5 rounded-md"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Header1;
