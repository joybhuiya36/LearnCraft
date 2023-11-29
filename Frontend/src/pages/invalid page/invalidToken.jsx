import React from "react";
import { Link } from "react-router-dom";

const InvalidToken = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white mt-[-20%] p-8 rounded-md shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Invalid Token</h2>
        <p className="text-gray-600 mb-4">
          The token provided is invalid or has expired. Please try again.
        </p>
        <Link to="/" className="text-[#0689b6]">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default InvalidToken;
