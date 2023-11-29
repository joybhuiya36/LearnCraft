import React, { useEffect, useState } from "react";
import useReviewRatingHook from "../../Hooks/reviewRatingCustomHook";
import Star from "../icons/startRating";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import ChangableStar from "../icons/changableStarRating";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ReviewRatings = ({ courseId, enrolled }) => {
  const {
    getReviewRating,
    reviews,
    ratings,
    addNewReviewRating,
    editReviewRating,
    deleteReviewRating,
  } = useReviewRatingHook();
  const userId = useSelector((state) => state.user.id);
  const [edit, setEdit] = useState(false);
  const [isGiven, setIsGiven] = useState(false);
  const [editReview, setEditReview] = useState("");
  const [editRating, setEditRating] = useState(0);

  useEffect(() => {
    getReviewRating(courseId);
  }, []);
  useEffect(() => {
    if (reviews) {
      const found = reviews.findIndex((review) => review.user._id == userId);
      if (found !== -1) {
        setIsGiven(true);
      }
    }
  }, [reviews]);

  const handleGetRating = (newRating) => {
    setEditRating(newRating);
  };
  const handleNewReviewRating = () => {
    if (editRating == 0) {
      toast.error("Rating Can't be Zero!");
      return;
    }
    addNewReviewRating(courseId, editRating, editReview);

    setIsGiven(true);
  };
  const handleEdit = (rating, review) => {
    setEdit(true);
    setEditRating(rating);
    setEditReview(review);
  };
  const handleEditSubmit = () => {
    editReviewRating(courseId, editRating, editReview);
    setEdit(false);
    setEditRating(0);
    setEditReview("");
  };
  const handleDelete = () => {
    deleteReviewRating(courseId);
    setIsGiven(false);
    setEditRating(0);
    setEditReview("");
  };
  return (
    <div>
      <div className="mb-8 ml-[-35%]">
        <div className="mb-2">
          <span className="text-4xl font-semibold">{ratings}</span>
          <span className="text-xl font-semibold">/5</span>
        </div>
        <Star rating={ratings} size={"3em"} />
        <div className="ml-2 mt-1">{reviews?.length} Ratings</div>
      </div>
      {!isGiven && enrolled && (
        <div className="bg-gray-100 p-6">
          <h2 className="font-semibold mb-2">Give Your Review Rating</h2>
          <ChangableStar preRating={0} getRating={handleGetRating} />
          <br />
          <textarea
            name="review"
            rows="4"
            className="border focus:outline-none w-[33vw] my-4"
            value={editReview}
            onChange={(e) => setEditReview(e.target.value)}
          ></textarea>
          <br />

          <button
            className="bg-[#0689b6] px-2 py-1 rounded-md text-white text-sm"
            onClick={handleNewReviewRating}
          >
            Submit
          </button>
        </div>
      )}
      {reviews?.map((review) => (
        <div key={review.user._id} className="my-4 border-b-[1px] pb-2">
          <div className="flex items-center">
            <img
              src={review?.user?.avatar}
              className="w-[40px] h-[40px] rounded-full mr-2"
            />
            <h3 className="text-md font-semibold">{review?.user?.name}</h3>
          </div>
          <div className="ml-6 flex">
            <div className="w-[30vw]">
              {review.user._id == userId && edit ? (
                <ChangableStar
                  preRating={editRating}
                  getRating={handleGetRating}
                />
              ) : (
                <Star rating={review?.rating} size={"20px"} />
              )}
              <p>
                {review.user._id == userId && edit ? (
                  <input
                    type="text"
                    className="mt-2 border w-[28vw] p-2 focus:outline-none"
                    value={editReview}
                    onChange={(e) => {
                      setEditReview(e.target.value);
                    }}
                  />
                ) : (
                  review?.review
                )}
              </p>
              {review.user._id == userId && edit && (
                <button
                  className="bg-[#0689b6] mt-2 px-2 py-1 rounded-md text-white text-sm"
                  onClick={handleEditSubmit}
                >
                  Submit
                </button>
              )}
            </div>
            {review.user._id == userId && (
              <div>
                <button
                  className="block mb-3 hover:text-blue-600"
                  onClick={() => handleEdit(review.rating, review.review)}
                >
                  <RiEdit2Fill />
                </button>
                <button
                  className="block hover:text-red-500"
                  onClick={handleDelete}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewRatings;
