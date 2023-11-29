import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Star from "../../components/icons/startRating";
import ms from "ms";
import axiosIntance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { increase } from "../../redux/slices/cartCountSlice";
import { useDispatch, useSelector } from "react-redux";
import { GiStairs } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { MdOutlineAccessTime } from "react-icons/md";
import { PiTargetBold } from "react-icons/pi";
import { PiStudentFill } from "react-icons/pi";
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { BsFileEarmarkCheck } from "react-icons/bs";
import ReactQuill from "react-quill";
import DropBox from "../../components/icons/dropBox";
import ReviewRatings from "../../components/reviewRatings/reviewRatings";
import { Player } from "video-react";
import LoadingPage from "../loading page/loading";
import WebcamRecording from "../../components/webCamRecorder/webCamRecording";
import Forum from "../../components/forum/forum";

const CourseContent = () => {
  const [course, setCourse] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const [tab, setTab] = useState("content");
  const [trigger, setTrigger] = useState(false);
  const [creator, setCreator] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [contentID, setContentID] = useState("");
  const role = useSelector((state) => state.user.role);
  const userId = useSelector((state) => state.user.id);
  const [enrolled, setEnrolled] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!isChecked);
  };

  useEffect(() => {
    setLoading(true);
    axiosIntance.get(`/course/getone/${courseId}`).then((res) => {
      setCourse(res.data.data);
      if (res.data.data.instructor._id == userId) setCreator(true);
      if (res.data.data.students.includes(userId)) setEnrolled(true);
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [trigger]);
  const handleCart = () => {
    axiosIntance
      .post("/cart/addtocart", { courseId: course._id })
      .then((res) => {
        dispatch(increase());
        toast.success("Course is Added to Cart!");
      })
      .catch((err) => toast.error(err.response.data.message));
  };
  const handleWishlist = () => {
    axiosIntance
      .post("/wishlist/addtowishlist", { courseId: course._id })
      .then((res) => {
        toast.success("Course is Added to Wishlist!");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  const lessonClick = (id) => {
    if (role != 1 && !creator && !enrolled) return;
    navigate(`/course/${course._id}/content/${id}`);
  };
  const handleVideoFile = (file) => {
    console.log("fileee", file);
    const videoPreviewURL = URL.createObjectURL(file);
    setVideoURL(videoPreviewURL);
    setVideoFile(file);
  };
  const handleDescChange = (content) => {
    setDesc(content);
  };
  const handleCreateContent = () => {
    setLoading(true);
    if (title.length == 0 || (!editStatus && !videoFile)) {
      toast.error("Please Fill the All Field!");
      setLoading(false);
      return;
    }
    console.log(videoFile);
    const formData = new FormData();
    formData.append("courseId", course._id);
    formData.append("title", title);
    formData.append("text", desc);
    formData.append("video", videoFile);
    if (editStatus) {
      formData.append("contentId", contentID);
      axiosIntance
        .patch("/content/edit", formData)
        .then((res) => {
          setLoading(false);
          setTrigger(!trigger);
          toast.success("Content is Updated Successfully!");
          setTab("content");
          setEditStatus(false);
          setVideoURL("");
          setVideoFile(null);
          setTitle("");
          setDesc("");
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Failed to Update Content!");
          console.log(err);
        });
    } else {
      console.log("create click", videoFile);
      axiosIntance
        .post("/content/create", formData)
        .then((res) => {
          setLoading(false);
          setTab("content");
          setVideoURL("");
          setVideoFile(null);
          setTrigger(!trigger);
          toast.success("Content is Created Successfully!");
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Failed to Create Contentaaa!");
          console.log(err);
        });
    }
  };
  const handleEdit = (contentId, title, text) => {
    setEditStatus(true);
    setTab("createContent");
    setTitle(title);
    setDesc(text);
    setContentID(contentId);
  };
  const handleDelete = (contentId) => {
    axiosIntance
      .delete(`/content/delete/${courseId}/${contentId}`)
      .then((res) => {
        setTrigger(!trigger);
        toast.success("Content is Successfully Deleted!");
      })
      .catch((err) => toast.error("Failed to Delete Content!"));
  };
  const handleCourseEdit = () => {
    navigate(`/edit-course/${courseId}`, {
      state: {
        title: course.title,
        desc: course.desc,
        category: course.category,
        level: course.level,
        preRequisite: course.preRequisite,
      },
    });
  };
  const handleCourseDelete = () => {
    axiosIntance
      .delete(`/course/delete/${courseId}`)
      .then((res) => {
        navigate("/course");
        toast.success("Course is Successfully Deleted!");
      })
      .catch((err) => toast.error("Failed to Delete Course!"));
  };

  return (
    <div className="min-h-screen">
      {loading && <LoadingPage />}
      {role == 1 && (
        <div className="flex justify-end mt-4 mr-4">
          <button onClick={handleCourseEdit}>
            <FaEdit className="text-xl mr-4 hover:text-blue-600" />
          </button>
          <button onClick={handleCourseDelete}>
            <MdDeleteForever className="text-2xl mr-4 hover:text-red-600" />
          </button>
        </div>
      )}
      <div className="flex m-4">
        <div className="m-10 w-[25%]">
          <img
            src={course?.thumbnail}
            className="w-full h-[200px] object-cover rounded-lg shadow-lg"
            alt={course?.title}
          />
        </div>
        <div className="w-[40%] ml-10 mt-10">
          <h2 className="text-3xl font-semibold mb-4">{course?.title}</h2>
          <p className="text-gray-600 text-[15px]">{course?.desc}</p>
          <div className="flex items-center mt-4">
            <Star rating={course?.rating} size={"28px"} />
            <span className="ml-2 text-gray-700">
              {course?.rating?.toFixed(2)} stars
            </span>
          </div>
          <div className="flex items-center mt-4">
            <span className="mr-2">
              <FaChalkboardTeacher className="text-2xl inline-block mr-2" />
            </span>
            <div className="flex items-center">
              <img
                src={course?.instructor?.avatar}
                className="h-10 w-10 rounded-full object-cover"
                alt={course?.instructor?.name}
              />
              <span className="ml-2 font-semibold">
                {course?.instructor?.name}
              </span>
            </div>
            {enrolled && (
              <div className="text-xl text-green-900  border-2 flex items-center border-green-200 rounded-md bg-green-100 px-4 py-2 ml-[14vw]">
                <BsFileEarmarkCheck className="inline-block text-2xl text-green-900 mr-3" />
                Enrolled
              </div>
            )}
          </div>
          <div className="flex items-center mt-4">
            <p className="mr-2">
              <PiStudentFill className="text-2xl inline-block mr-3" />
              {course?.students?.length}
              {course?.students?.length === 1 ? " Student" : " Students"}
            </p>

            {role == 3 && !enrolled && (
              <div className="ml-[10vw] flex-col">
                <button
                  className="bg-[#0689b6] text-white px-4 py-2 rounded-md mb-2 w-[20vw]"
                  onClick={handleCart}
                >
                  <FaCartPlus className="inline-block text-xl" /> Add to Cart
                </button>
                <br />
                <button
                  className="bg-[#0689b6] text-white px-4 py-2 rounded-md w-[20vw]"
                  onClick={handleWishlist}
                >
                  <MdFavorite className="inline-block text-2xl" /> Add to
                  Wishlist
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Course Details */}
        <div className="w-[20%] ml-10 mt-10">
          <h3 className="text-xl font-semibold mb-2">Course Details</h3>
          <p>
            <TbCategoryFilled className="text-2xl inline-block mr-2" />
            {course?.category}
          </p>
          <p>
            <GiStairs className="text-2xl inline-block mr-2" /> {course?.level}
          </p>
          <p>
            <PiTargetBold className="text-2xl inline-block mr-2" />
            {course?.preRequisite}
          </p>
          <p>
            <MdOutlineAccessTime className="text-2xl inline-block mr-2" />
            {course?.duration && ms(course?.duration * 1000, { long: true })}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <nav className="flex space-x-8">
          <p
            className={`${
              tab == "content" && "font-bold underline underline-offset-8"
            } cursor-pointer`}
            onClick={() => {
              setTab("content");
            }}
          >
            Content
          </p>
          {creator && (
            <p
              className={`${
                tab == "createContent" &&
                "font-bold underline underline-offset-8"
              } cursor-pointer`}
              onClick={() => {
                setTab("createContent");
              }}
            >
              {editStatus ? "Update " : "Create "} Content
            </p>
          )}
          <p
            className={`${
              tab == "reviewRating" && "font-bold underline underline-offset-8"
            } cursor-pointer`}
            onClick={() => {
              setTab("reviewRating");
            }}
          >
            Reviews Ratings
          </p>
          {(creator || enrolled) && (
            <p
              className={`${
                tab == "forum" && "font-bold underline underline-offset-8"
              } cursor-pointer`}
              onClick={() => {
                setTab("forum");
              }}
            >
              Discussion Forum
            </p>
          )}
        </nav>
      </div>

      {/* tabs */}
      {tab == "content" && (
        <div className="w-[70%] mt-8 mx-[auto]">
          {course?.content?.map((lesson) => (
            <div
              key={lesson._id}
              className="flex items-center mb-4 cursor-pointer p-2 border-b-2 border-solid hover:bg-gray-200"
            >
              <div
                className="flex w-[90%]"
                onClick={() => {
                  lessonClick(lesson._id);
                }}
              >
                <img src={course.thumbnail} className="h-[50px]" />
                <div className="ml-6">
                  <h4 className="text-lg font-semibold">{lesson.title}</h4>
                  {lesson?.videoDuration > 0 &&
                    ms(lesson.videoDuration * 1000, { long: true })}
                </div>
              </div>
              {role != 1 && !creator && !enrolled && <FaLock />}
              {creator && (
                <div className="flex flex-col items-center ml-[4vw]">
                  <button
                    onClick={() => {
                      handleEdit(lesson._id, lesson.title, lesson.text);
                    }}
                  >
                    <MdEditSquare className="text-xl hover:text-[#0689b6]" />
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(lesson._id);
                    }}
                  >
                    <MdDelete className="text-2xl hover:text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {tab == "createContent" && (
        <div className="w-[50vw] mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            {editStatus ? "Update a " : "Create New "} Content
          </h2>
          <div className="px-[5vw]">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-600"
              >
                Title:
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 w-[36vw] border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-600"
              >
                Description:
              </label>
              <ReactQuill
                className="w-[36vw] h-[16em] mb-4"
                value={desc}
                onChange={handleDescChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="video"
                className="block text-sm font-medium mt-[4em] text-gray-600"
              >
                Video:
                <label className="flex items-center cursor-pointer mt-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isChecked}
                      onChange={handleToggle}
                    />
                    <div
                      className={`toggle-switch w-10 h-5 ${
                        isChecked ? "bg-blue-500" : "bg-gray-400"
                      } rounded-full shadow-inner transition duration-300 ease-in-out`}
                    ></div>
                    <div
                      className={`dot absolute w-4 h-4 ${
                        isChecked ? "bg-white left-6" : "bg-white"
                      } rounded-full shadow inset-y-0 left-0 transition duration-300 ease-in-out`}
                    ></div>
                  </div>
                </label>
              </label>
              {!isChecked && (
                <div className="flex items-center justify-center">
                  <DropBox fileType={"video/"} callBackFunc={handleVideoFile} />
                </div>
              )}
              {isChecked && (
                <WebcamRecording handleVideoFile={handleVideoFile} />
              )}
            </div>
            {videoURL.length > 0 && (
              <div className="mb-4 border border-black border-dashed p-2">
                <Player src={videoURL} />
              </div>
            )}
            <div className="mb-4">
              <button
                onClick={handleCreateContent}
                disabled={loading == true}
                className="bg-[#0689b6] text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
              >
                {editStatus
                  ? loading
                    ? "Updating..."
                    : "Update Content"
                  : loading
                  ? "Creating..."
                  : "Create Content"}
              </button>
            </div>
          </div>
        </div>
      )}
      {tab == "reviewRating" && (
        <div className="flex justify-center items-center">
          <div className="mt-8">
            <ReviewRatings courseId={courseId} enrolled={enrolled} />
          </div>
        </div>
      )}
      {tab == "forum" && (
        <div className="flex justify-center items-center">
          <Forum courseId={courseId} instructor={course.instructor._id} />
        </div>
      )}
    </div>
  );
};

export default CourseContent;
