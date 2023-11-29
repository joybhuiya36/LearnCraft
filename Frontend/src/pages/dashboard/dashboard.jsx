import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Star from "../../components/icons/startRating";
import { FaUserTie } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdSubscriptions } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { IoMdCloseCircle } from "react-icons/io";
import { GrStatusGoodSmall } from "react-icons/gr";
import { FaBookMedical } from "react-icons/fa";
import { FaUsersCog } from "react-icons/fa";
import axiosIntance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import CreateCourse from "../course/createCourse";
import AllUsers from "../../components/user/allUsers";

const DashboardPage = () => {
  const [trigger, setTrigger] = useState(false);
  const [userData, setUserData] = useState({});
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("userDetails");
  const [subs, setSubs] = useState([]);
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (role == 1) {
      axiosInstance("/course/pending").then((res) => {
        setCourses(res.data.data);
        axiosInstance("/subs/all").then((res) => {
          setSubs(res.data.data);
        });
      });
    }
    axiosInstance("/user/details").then((res) => {
      setUserData(res.data.data);
      if (role != 1) setCourses(res.data.data.approvedCourses);
    });
  }, [trigger]);

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleUpload = (e) => {
    const formData = new FormData();
    formData.append("pic", e.target.files[0]);
    axiosInstance
      .post("/user/change-profile", formData)
      .then((res) => {
        toast.success("Profile Picture is Changed Successfully!");
        setTrigger(!trigger);
      })
      .catch((err) => toast.error("Failed to Update Profile Picture!"));
  };

  const handleCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };
  const handleAprrove = (courseId) => {
    axiosIntance
      .post("/admin/course-approve", { courseId })
      .then((res) => {
        setTrigger(!trigger);
        toast.success("Course is Approved!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to Approve Course!");
      });
  };
  const handleRemove = (courseId) => {
    axiosInstance
      .delete(`/course/delete/${courseId}`)
      .then((res) => {
        setTrigger(!trigger);
        toast.success("Course is Deleted!");
      })
      .catch((err) => toast.error("Failed to Remove Course!"));
  };
  const handleStatus = (id, userId, courseId, status) => {
    if (status == "approve") {
      axiosInstance
        .post("/admin/sub-approve", { id, userId, courseId })
        .then((res) => {
          setTrigger(!trigger);
          toast.success("Course is Aprroved Successfully!");
        })
        .catch((err) => toast.error("Failed to Approve Course!"));
    } else if (status == "reject") {
      axiosInstance
        .post("/admin/sub-reject", { id, userId, courseId })
        .then((res) => {
          setTrigger(!trigger);
          toast.success("Course is Rejected Successfully!");
        })
        .catch((err) => toast.error("Failed to Reject Course!"));
    }
  };
  return (
    <div className="flex h-[100vh]">
      {/* Sidebar */}
      <div className="bg-gray-200  h-[100vh] pl-8 py-11">
        <div
          className={`cursor-pointer w-[14em] mb-6 ${
            activeTab === "userDetails" && "font-bold"
          }`}
          onClick={() => switchTab("userDetails")}
        >
          <FaUserTie className="inline-block text-2xl mr-2" /> Profile
        </div>
        {role == 2 && (
          <div
            className={`cursor-pointer w-[14em] mb-6 ${
              activeTab === "createCourse" && "font-bold"
            }`}
            onClick={() => switchTab("createCourse")}
          >
            <FaBookMedical className="inline-block text-2xl mr-2" /> Create
            Course
          </div>
        )}
        {role != 1 && (
          <div
            className={`cursor-pointer w-[14em] mb-6 ${
              activeTab === "approvedCourses" && "font-bold"
            }`}
            onClick={() => switchTab("approvedCourses")}
          >
            <FaBook className="inline-block mr-3 text-2xl" />
            {role == 2 ? "Created" : "My"} Courses
          </div>
        )}
        {role == 1 && (
          <div
            className={`cursor-pointer w-[14em] mb-6 ${
              activeTab === "pendingCourses" && "font-bold"
            }`}
            onClick={() => switchTab("pendingCourses")}
          >
            <MdOutlinePendingActions className="inline-block ml-[-3px] mr-3 text-3xl" />
            Pending Courses
          </div>
        )}
        {role == 1 && (
          <div
            className={`cursor-pointer w-[14em] mb-6 ${
              activeTab === "subscriptionReq" && "font-bold"
            }`}
            onClick={() => switchTab("subscriptionReq")}
          >
            <MdSubscriptions className="inline-block mr-3 text-2xl" />
            Subscription Request
          </div>
        )}
        {role == 1 && (
          <div
            className={`cursor-pointer w-[14em] mb-6 ${
              activeTab === "allUsers" && "font-bold"
            }`}
            onClick={() => switchTab("allUsers")}
          >
            <FaUsersCog className="inline-block mr-3 text-3xl" />
            All Users
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto my-8 p-4 w-3/4">
        {activeTab === "userDetails" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-10">User Information</h2>
            <div className="flex">
              <div className="relative">
                <img
                  src={userData?.avatar}
                  alt="User Avatar"
                  className="w-[8em] h-[8em] rounded-full mr-10 object-cover shadow-md"
                />
                <input
                  type="file"
                  className="absolute top-0 left-0 w-[8em] h-[8em] opacity-0 rounded-full cursor-pointer"
                  onChange={(e) => {
                    handleUpload(e);
                  }}
                />
              </div>
              <div>
                <p>Name: {userData?.name}</p>
                <p>Email: {userData?.email}</p>
                <p>
                  Role:
                  {role === 1
                    ? " Admin"
                    : role === 2
                    ? " Instructor"
                    : " Student"}
                </p>
                <p>Phone: {userData?.phone}</p>
                <p>Address: {userData?.address}</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === "createCourse" && (
          <div className="h-[100%] overflow-auto">
            <CreateCourse />
          </div>
        )}
        {activeTab === "approvedCourses" && (
          <div className="h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-6">
              {role == 2 ? "Created" : "My"} Courses
            </h2>
            {courses.length === 0 ? (
              <p>No courses.</p>
            ) : (
              <ul className="flex gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="mb-4 w-[20vw] border p-4 cursor-pointer"
                    onClick={() => {
                      handleCourse(course._id);
                    }}
                  >
                    <div>
                      <img
                        src={course.thumbnail}
                        className="w-[8em] h-[5em] object-cover mr-4"
                      />
                      <div>
                        <h2 className="text-xl font-bold">{course.title}</h2>
                        <Star rating={course.rating} size={"20px"} />
                        <p className="text-gray-600">Level: {course.level}</p>

                        <p className="text-gray-600">
                          {course.students.length}
                          {course.students.length > 1
                            ? " Students"
                            : " Student"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </div>
        )}
        {activeTab === "allUsers" && (
          <div>
            <AllUsers />
          </div>
        )}
        {activeTab === "pendingCourses" && (
          <div>
            <div className="h-[90vh] overflow-auto">
              <h2 className="text-2xl font-bold mb-6">Pending Courses</h2>
              <div>
                {courses.map((course) => (
                  <li
                    key={course._id}
                    className="mb-4 border p-4 flex items-center justify-between"
                  >
                    <div className="flex">
                      <img
                        src={course.thumbnail}
                        className="w-[8em] h-[5em] object-cover mr-4"
                      />
                      <div>
                        <h2 className="text-xl font-bold">{course.title}</h2>
                        <p className="flex items-center text-gray-600 my-1">
                          <img
                            src={course.instructor.avatar}
                            className="h-[30px] w-[30px] rounded-full mr-2"
                          />
                          {course.instructor.name}
                        </p>
                        <p className="text-gray-600">Level: {course.level}</p>
                      </div>
                    </div>
                    <div>
                      <button
                        className="text-4xl text-green-600 mr-4 hover:text-green-700"
                        onClick={() => handleAprrove(course._id)}
                      >
                        <TiTick />
                      </button>
                      <button
                        className="text-3xl text-red-500 hover:text-red-700 font-bold"
                        onClick={() => handleRemove(course._id)}
                      >
                        <IoMdCloseCircle />
                      </button>
                    </div>
                  </li>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === "subscriptionReq" && (
          <div>
            <div className="h-[90vh] overflow-auto">
              <h2 className="text-2xl font-bold mb-6">Subscription Requests</h2>
              <div>
                {subs?.map((sub) => (
                  <div
                    key={sub._id}
                    className="mb-4 border-solid border-[1px] border-gray-400 rounded-md p-4"
                  >
                    <div className="flex items-center border-solid border-b-[2px] border-gray-200 pb-2">
                      <img
                        src={sub.user.avatar}
                        className="w-11 h-11 rounded-full mr-2"
                        alt={`${sub.user.name}'s Avatar`}
                      />
                      <div>
                        <p className="font-semibold">{sub.user.name}</p>
                        <p className="text-sm text-gray-600">
                          {sub.user.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      {sub.courses?.map((item) => (
                        <div className="flex mt-4" key={item.course._id}>
                          <div className="flex flex-1">
                            <img
                              src={item.course.thumbnail}
                              className="w-[100px] h-[60px] object-cover mr-3"
                              alt={`${item.course.title} Thumbnail`}
                            />
                            <div>
                              <h2 className="font-semibold">
                                {item.course.title}
                              </h2>
                              <Star rating={item.course.rating} size={"20px"} />
                              <p>
                                ({item.course.students.length}{" "}
                                {item.course.students.length > 1
                                  ? "Students"
                                  : "Student"}
                                )
                              </p>
                            </div>
                          </div>
                          <div className="flex-1">
                            <GrStatusGoodSmall
                              className={`text-[10px] inline-block mr-2 ${
                                item.status === "pending"
                                  ? "text-yellow-500"
                                  : item.status === "approved"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                            {item.status}
                          </div>
                          <div>
                            <select
                              className="border-solid border-[1px] border-[#363535] rounded-md"
                              name="status"
                              onChange={(e) => {
                                handleStatus(
                                  sub._id,
                                  sub.user._id,
                                  item.course._id,
                                  e.target.value
                                );
                              }}
                              disabled={item.status !== "pending"}
                            >
                              <option value="pending">Pending</option>
                              <option value="approve">Approve</option>
                              <option value="reject">Reject</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
