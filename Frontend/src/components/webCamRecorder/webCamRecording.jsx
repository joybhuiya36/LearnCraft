import React, { useState, useEffect } from "react";
import RecordRTC from "recordrtc";
import { FaPlay } from "react-icons/fa";
import { BsFillRecordFill } from "react-icons/bs";
import { FaStop } from "react-icons/fa";

const WebcamRecording = ({ handleVideoFile }) => {
  const [recorder, setRecorder] = useState(null);
  const [webcamStream, setWebcamStream] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);

  useEffect(() => {
    initializeWebcam();
  }, []);

  const initializeWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setWebcamStream(stream);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const startRecording = () => {
    if (webcamStream) {
      const newRecorder = RecordRTC(webcamStream, {
        type: "video",
        mimeType: "video/mp4",
        videoBitsPerSecond: 1200000,
      });

      newRecorder.startRecording();
      setRecorder(newRecorder);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        setRecordedBlob(blob);
        handleVideoFile(blob);
        setRecorder(null);
      });
    }
  };

  return (
    <div className="text-center m-auto">
      <div className="mx-auto flex items-center justify-center">
        <button
          onClick={startRecording}
          className="text-white bg-green-500 px-4 py-2 rounded-md mr-4 w-[14vw]"
        >
          {recorder ? (
            <div className="flex items-center justify-center">
              <BsFillRecordFill className="text-2xl mr-2" /> Recording...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <FaPlay className="mr-2" /> Start Recording
            </div>
          )}
        </button>
        <button
          onClick={stopRecording}
          disabled={!recorder}
          className="text-white bg-red-500 px-4 py-2 rounded-md w-[14vw]"
        >
          <div className="flex items-center justify-center">
            <FaStop className="mr-2" /> Stop Recording
          </div>
        </button>
      </div>

      <video
        id="webcamVideo"
        autoPlay
        playsInline
        muted
        ref={(video) => {
          if (video) video.srcObject = webcamStream;
        }}
        className="border border-black bg-black m-auto mt-3"
        style={{ width: "100%", maxHeight: "300px" }}
      ></video>
    </div>
  );
};

export default WebcamRecording;
