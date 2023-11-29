import React, { useState } from "react";
import { toast } from "react-toastify";

const DropBox = ({ text, fileType, callBackFunc }) => {
  const [videoFile, setVideoFile] = useState(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // console.log(selectedFile.type);
    if (selectedFile && selectedFile.type.startsWith(fileType)) {
      setVideoFile(selectedFile);
      callBackFunc(selectedFile);
    } else {
      if (fileType == "video/") toast.error("Select a Video File!");
      else if (fileType == "image/") toast.error("Select an Image File!");
    }
  };
  return (
    <div className="max-w-md p-6 bg-white rounded-md">
      <h3 className="text-xl font-semibold mb-4">{text}</h3>
      <div className="relative border-dashed border-2 border-gray-300 p-6 rounded-md cursor-pointer">
        <input
          type="file"
          onChange={(e) => {
            handleFileChange(e);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center ">
          <svg
            className="w-8 h-8 text-gray-400 mb-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span className="text-sm text-gray-600 cursor-pointer">
            Drag and drop or click to upload
          </span>
        </div>
      </div>
    </div>
  );
};

export default DropBox;
