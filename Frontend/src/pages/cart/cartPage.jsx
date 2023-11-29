import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Star from "../../components/icons/startRating";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import axiosIntance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { countZero } from "../../redux/slices/cartCountSlice";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    axiosInstance("/cart/view")
      .then((res) => {
        setCartItems(res.data.data.courses);
      })
      .catch((err) => {
        setCartItems([]);
        dispatch(countZero());
      });
  }, [trigger]);

  const removeItem = (courseId) => {
    axiosInstance
      .delete(`/cart/remove/${courseId}`)
      .then((res) => {
        setTrigger(!trigger);
        toast.success("Course is Removed from Cart Successfully!");
      })
      .catch((err) => toast.error("Failed to Remove from Cart!"));
  };
  const handleCheckout = () => {
    axiosIntance
      .post("/cart/checkout")
      .then((res) => {
        setTrigger(!trigger);
        dispatch(countZero());
        toast.success("Successfully Checked Out!");
      })
      .catch((err) => toast.error("Failed to Checkout!"));
  };

  return (
    <div className="container mx-auto my-8 p-4 h-[70vh]">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {cartItems?.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems?.map((item) => (
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
              <div>
                <button
                  className="text-2xl hover:text-red-500 font-bold"
                  onClick={() => removeItem(item._id)}
                >
                  <RiDeleteBack2Fill />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8 flex justify-end">
            <button
              className="bg-[#0689b6] text-white px-4 py-2 rounded"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
