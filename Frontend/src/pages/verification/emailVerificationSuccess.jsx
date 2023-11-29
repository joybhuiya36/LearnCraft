import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import axiosIntance from "../../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EmailVerificationSuccess = () => {
  const { token, userId } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    axiosIntance
      .post("/auth/verify-request", { userId, token })
      .then(() => {
        axiosIntance
          .post("/auth/verify-email", { userId })
          .then(() => {
            setLoading(false);
            toast("Email is Verified Successfully!");
          })
          .catch((err) => toast("Failed to Verify Email!"));
      })
      .catch((err) => {
        console.log(err);
        navigate("/invalid-token");
      });
  }, []);
  return (
    <div>
      {loading ? (
        <div></div>
      ) : (
        <div className="flex items-center justify-center mt-[20vh]">
          <div className="bg-white p-8 rounded-md shadow-md text-center">
            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
            <h2 className="text-2xl font-semibold mb-4">
              Email Verification Successful!
            </h2>
            <p>Your email has been successfully verified.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationSuccess;
