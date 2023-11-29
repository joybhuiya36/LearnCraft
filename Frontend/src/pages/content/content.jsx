import React, { useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import ms from "ms";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DropBox from "../../components/icons/dropBox";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import useQuiz from "../../Hooks/quizCustomHook";

const Content = () => {
  const navigate = useNavigate();
  const { courseId, contentId } = useParams();
  const { submitData, viewSubmission } = useQuiz();
  const [contents, setContents] = useState([]);
  const [content, setContent] = useState({});
  const [thum, setThum] = useState("");
  const [isCreator, setCreator] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const role = useSelector((state) => state.user.role);
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    if (file != null) return;
    window.scrollTo(0, 0);

    axiosIntance(`/course/getone/${courseId}`).then((res) => {
      if (
        !res?.data?.data?.students?.includes(userId) &&
        role != 1 &&
        res?.data?.data?.instructor?._id != userId
      ) {
        navigate("/not-found");
      }
      if (res?.data?.data?.instructor?._id == userId) setCreator(true);
      else {
        axiosIntance(`/assignment/check/${userId}/${contentId}`).then((res) =>
          setSubmitted(true)
        );
      }

      setContents(res.data.data.content);
      setThum(res.data.data.thumbnail);
    });
    axiosIntance(`/content/view/${contentId}`).then((res) => {
      setContent(res.data.data);
      if (res?.data?.data?.assignment.length == 0) setSubmitted(true);
    });
    viewSubmission(contentId, userId);
  }, [file]);
  const contentClick = (id) => {
    navigate(`/course/${courseId}/content/${id}`);
    window.location.reload();
  };
  const handleQuizPage = () => {
    if (role == 1 || isCreator)
      navigate(`/all-quizzes/${contentId}`, {
        state: { isCreator: isCreator },
      });
    else if (Object.keys(submitData).length > 0)
      navigate(`/quiz-submit/${contentId}`);
    else
      navigate(`/quiz/${contentId}`, {
        state: { lessonName: content.title },
      });
  };

  const downloadAssignment = () => {
    if (content.assignment.length == 0) {
      toast("No Assignment!");
      return;
    }
    const downloadLink = content.assignment;
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = "Assignment";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleFile = (uploadFile) => {
    setFile(uploadFile);
  };
  const handleSubmit = () => {
    if (!file) {
      toast.error("Select a File First!");
      return;
    }
    const formData = new FormData();
    formData.append("contentId", contentId);
    formData.append("assignment", file);
    if (isCreator) {
      axiosIntance
        .post("/assignment/upload", formData)
        .then((res) => {
          toast.success("Assignment is Uploaded Successfully!");
          setFile(null);
        })
        .catch((err) => toast.error("Failed to Upload Assignment!"));
    } else {
      formData.append("userId", userId);
      axiosIntance
        .post("/assignment/submit", formData)
        .then((res) => {
          toast.success("Assignment is Submitted Successfully!");
          setFile(null);
        })
        .catch((err) => {
          toast.error("Failed to Submit Assignment!");
          console.log(err);
        });
    }
  };
  return (
    <div className="flex">
      <div className="m-10 ">
        <Player
          playsInline
          fluid={false}
          src={content.video}
          width={853}
          height={480}
        />
        <h2 className="mt-6 text-2xl font-semibold">{content.title}</h2>
        <ReactQuill
          theme="snow"
          value={content.text}
          className="my-6 w-[62vw]"
          modules={{ toolbar: false }}
          readOnly
        />
        <button
          className="bg-[#0689b6] text-white p-2 rounded-md"
          onClick={handleQuizPage}
        >
          Click Here to Go to Quiz Page
        </button>
        <button
          className="bg-[#0689b6] text-white p-2 rounded-md ml-8"
          onClick={downloadAssignment}
        >
          Click Here to Download Assignment
        </button>
        <br />
        {((!isSubmitted && role != 1) || isCreator) && (
          <div>
            <DropBox
              text={
                isCreator ? "Assign an Assignment" : "Upload Your Assignment"
              }
              fileType=""
              callBackFunc={handleFile}
            />
            <button
              className="text-white bg-[#0689b6] px-2 py-1 rounded-md ml-3 w-[50%]"
              onClick={handleSubmit}
            >
              Upload
            </button>
          </div>
        )}
      </div>
      <div className="ml-[2vw] mt-10 p-2 w-[25%] max-h-[70vh] overflow-auto border-2">
        {contents?.map((x) => (
          <div
            key={x._id}
            className={`flex p-2 cursor-pointer border-b-[1px] hover:bg-gray-200 ${
              x._id == contentId && "bg-gray-300"
            }`}
            onClick={() => contentClick(x._id)}
          >
            <div className="flex">
              <img src={thum} className="h-12" />
              <div className="ml-6">
                <h2 className="text-md font-semibold">{x.title}</h2>
                <p className="text-gray-500">
                  {x.videoDuration > 0 &&
                    ms(x.videoDuration * 1000, { long: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
