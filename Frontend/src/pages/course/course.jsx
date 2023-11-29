import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";
import Cart from "../../components/cart/cart";
import { GrFormNextLink } from "react-icons/gr";
import { GrFormPreviousLink } from "react-icons/gr";
import { useSelector } from "react-redux";
import LoadingPage from "../loading page/loading";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [ratingValue, setRatingValue] = useState("0");
  const [ratingComparison, setRatingComparison] = useState("gt");
  const [levelFilter, setLevelFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const searchWord = useSelector((state) => state.search.keyword);

  useEffect(() => {
    setLoading(true);
    setTimeout(async () => {
      axiosIntance
        .get(
          `/course/all?page=${page}&limit=${4}&sortParam=${sortBy}&sortBy=${sortOrder}&rating=${ratingValue}&ratingFilter=${ratingComparison}&level=${levelFilter}&search=${searchWord}`
        )
        .then((res) => {
          setCourses(res.data.data);
        });
    }, 2000);
    setTimeout(() => {
      setLoading(false);
    }, 2200);
  }, [
    sortBy,
    sortOrder,
    ratingValue,
    ratingComparison,
    levelFilter,
    searchWord,
    page,
  ]);
  const clickFunc = (id) => {
    navigate(`/course/${id}`);
  };
  const TruncateText = (text, maxWords) => {
    const words = text.split(" ");

    if (words.length > maxWords) {
      const truncatedText = words.slice(0, maxWords).join(" ") + "...";
      return truncatedText;
    }

    return text;
  };
  return (
    <div className="min-h-screen">
      {loading && <LoadingPage />}
      <div className="flex justify-center mt-2">
        <div className="flex items-center justify-between rounded-lg bg-gray-300 px-[6vw] py-4 mb-4 w-[78vw]">
          <div className="flex space-x-2">
            <label className="flex items-center">
              Sort By:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-2 p-2 border rounded-md"
              >
                <option value="title">Title</option>
                <option value="rating">Rating</option>
              </select>
            </label>
            <label className="flex items-center">
              Order:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="ml-2 p-2 border rounded-md"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
          <div className="flex space-x-2">
            <label className="flex items-center mr-1">Rating Filter: </label>
            <input
              type="number"
              placeholder="Rating Value"
              value={ratingValue}
              min={0}
              max={5}
              onChange={(e) => setRatingValue(e.target.value)}
              className="p-2 border rounded-md w-[6em]"
            />
            <select
              value={ratingComparison}
              onChange={(e) => setRatingComparison(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="gt">Greater Equal</option>
              <option value="lt">Less Equal</option>
            </select>
          </div>
          <label className="flex items-center">
            Level:
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="ml-2 p-2 border rounded-md"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advance</option>
            </select>
          </label>
        </div>
      </div>
      <div className="min-h-[50vh]">
        {courses.map((course) => (
          <Cart
            key={course._id}
            id={course._id}
            title={course.title}
            desc={TruncateText(course.desc, 25)}
            thumbnail={course.thumbnail}
            rating={course.rating}
            level={course.level}
            students={course.students.length}
            duration={course.duration}
            instructor={course.instructor.name}
            instructorPic={course.instructor.avatar}
            onClickFunc={clickFunc}
          />
        ))}
      </div>
      <div className="flex items-center justify-center mt-6">
        <button disabled={page == 1} onClick={() => setPage(page - 1)}>
          <GrFormPreviousLink className="text-3xl" />
        </button>
        <span className="text-xl font-bold mx-6 px-2 border border-black rounded-full">
          {page}
        </span>
        <button
          disabled={courses.length < 4}
          onClick={() => {
            setPage(page + 1);
          }}
        >
          <GrFormNextLink className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default Course;
