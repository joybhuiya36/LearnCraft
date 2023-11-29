import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import loginLogo from "../../assets/login.jpeg";
import axiosIntance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../redux/slices/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    axiosIntance
      .post("/auth/login", data)
      .then((response) => {
        toast.success("Logged in Successfully!");
        const token = response.data.data.token;
        const info = {
          role: response.data.data.role,
          id: response.data.data.user._id,
          name: response.data.data.user.name,
          email: response.data.data.email,
          address: response.data.data.user.address,
          phone: response.data.data.user.phone,
        };
        dispatch(userLoginInfo(info));
        localStorage.setItem("token", token);
        axiosIntance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="flex items-center justify-center gap-[10%] min-h-screen">
      <img src={loginLogo} className="w-[35vw]" alt="login" />
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Link to="/forget-password" className="text-[#0689b6]">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="bg-[#0689b6] mt-3 text-white py-2 px-4 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
