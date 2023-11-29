import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Star from "../../components/icons/startRating";
import { FaCartPlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { increase } from "../../redux/slices/cartCountSlice";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    axiosInstance("/wishlist/all")
      .then((res) => {
        setWishlistItems(res.data.data.courses);
      })
      .catch((err) => {
        setWishlistItems([]);
      });
  }, [trigger]);
  const addToCart = (courseId) => {
    axiosInstance
      .post("/wishlist/addtocartone", { courseId })
      .then((res) => {
        dispatch(increase());
        setTrigger(!trigger);
        toast.success("Successfully Added to Cart!");
      })
      .catch((err) => toast.error("Failed to Add to Cart!"));
  };
  const removeItem = (courseId) => {
    axiosInstance
      .delete(`/wishlist/remove/${courseId}`)
      .then((res) => {
        setTrigger(!trigger);
        toast.success("Course is Removed from Wishlist Successfully!");
      })
      .catch((err) => toast.error("Failed to Remove!"));
  };

  return (
    <div className="container mx-auto my-8 p-4 h-[70vh]">
      <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
      {wishlistItems?.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div>
          {wishlistItems?.map((item) => (
            <div
              key={item._id}
              className="border p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-[12vh] w-[10vw] object-cover mr-4"
                />
                <div>
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p className="text-gray-600">{item.instructor.name}</p>
                  <Star rating={item.rating} size={"20px"} />
                </div>
              </div>
              <div className="flex flex-col items-center mr-[2vw]">
                <div>
                  <button
                    className="text-3xl hover:text-[#0689b6] p-2"
                    onClick={() => addToCart(item._id)}
                  >
                    <FaCartPlus />
                  </button>
                </div>
                <div>
                  <button
                    className="text-3xl hover:text-red-500"
                    onClick={() => removeItem(item._id)}
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
