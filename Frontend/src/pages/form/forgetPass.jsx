import React, { useState } from "react";
import axiosIntance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosIntance
      .post("/auth/forget-password", { recipient: email })
      .then((res) => {
        toast("An Email is Sent!");
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        toast(err.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-[30vw] mt-[-20%] p-8 rounded-md shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Forget Password</h2>

        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
          <label htmlFor="email" className="block text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full p-2 border rounded-md mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0689b6] text-white py-2 px-4 rounded-md"
          >
            {loading ? "Loading..." : "Confirm Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
