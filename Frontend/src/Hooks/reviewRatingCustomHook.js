import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const useReviewRating = () => {
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState(0);

  const getReviewRating = (courseId) => {
    axiosInstance(`/feedback/getone/${courseId}`)
      .then((res) => {
        setReviews(res.data.data.reviews);
        setRatings(res.data.data.totalRating);
      })
      .catch((err) => setReviews([]));
  };
  const addNewReviewRating = (courseId, rating, review) => {
    axiosInstance
      .post("/feedback/add", { courseId, rating, review })
      .then((res) => {
        toast.success("Review Rating is Successfully Added!");
        getReviewRating(courseId);
      })
      .catch((err) => toast.error("Failed to Add Review Rating!"));
  };
  const editReviewRating = (courseId, rating, review) => {
    axiosInstance
      .patch("/feedback/edit", { courseId, rating, review })
      .then((res) => {
        toast.success("Review Rating is Successfully Updated!");
        getReviewRating(courseId);
      })
      .catch((err) => toast.error("Failed to Update Review Rating!"));
  };
  const deleteReviewRating = (courseId) => {
    axiosInstance
      .delete(`/feedback/remove/${courseId}`)
      .then((res) => {
        toast.success("Review Rating is Successfully Deleted!");
        getReviewRating(courseId);
      })
      .catch((err) => toast.error("Failed to Delete Review Rating"));
  };

  return {
    reviews,
    ratings,
    getReviewRating,
    addNewReviewRating,
    editReviewRating,
    deleteReviewRating,
  };
};

export default useReviewRating;
