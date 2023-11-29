import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axiosIntance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token, userId } = useParams();
  const [pass, setPass] = useState("");
  const [conPass, setConPass] = useState("");
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    axiosIntance
      .post("/auth/reset-request", { token, userId })
      .then((res) => {})
      .catch((err) => {
        navigate("/invalid-token");
        return;
      });
  }, [token, userId, navigate]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!pass.trim()) {
      setErr("Password cannot be empty");
      return;
    }

    if (!passwordRegex.test(pass)) {
      setErr(
        "Password should be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (pass !== conPass) {
      setErr("Password doesn't match with the given password");
      return;
    }

    axiosIntance
      .post("/auth/reset-password", { userId, newPassword: pass })
      .then((res) => {
        console.log(res.data);
        toast("Password is Reset Successfully");
        navigate("/");
      })
      .catch((err) => {
        toast(err.response.data.message);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      {err.length > 0 && <h5 className="text-red-500 mb-4">{err}</h5>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-sm font-semibold">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPass(e.target.value)}
            value={pass}
            className="w-full p-2 border rounded-md pr-10"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute top-[40px] right-3 transform -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="mb-4 relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold"
          >
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            onChange={(e) => {
              setConPass(e.target.value);
              setErr("");
            }}
            value={conPass}
            className="w-full p-2 border rounded-md pr-10"
          />
          <button
            type="button"
            onClick={toggleShowConfirmPassword}
            className="absolute top-[40px] right-3 transform -translate-y-1/2 cursor-pointer"
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button
          type="submit"
          className="bg-[#0689b6] text-white py-2 px-4 rounded-md"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
