import React, { useEffect } from "react";
import bgImg from "../../assets/teacher.jpg";
import { useNavigate } from "react-router-dom";
import course from "../../assets/topCourse.json";
import Star from "../../components/icons/startRating";
import { GiStairs } from "react-icons/gi";
import { useSelector } from "react-redux";

const HomePage = () => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  const heroSectionStyle = {
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  return (
    <div>
      <section
        className="h-screen flex items-center justify-start"
        style={heroSectionStyle}
      >
        <div className="text-center ml-[4em] text-white">
          <h1 className="text-5xl font-extrabold mb-4">
            Learn Anytime, Anywhere
          </h1>
          <p className="text-lg">
            Empowering you with knowledge at your fingertips.
          </p>
          <button
            className="text-white bg-[#0689b6] hover:bg-[#068ab6c9] px-6 py-2 mt-8 rounded-full"
            onClick={() => {
              if (role) navigate("/course");
              else navigate("/login");
            }}
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Courses</h2>
          <div
            className="flex justify-center gap-10 cursor-pointer"
            onClick={() => navigate("/course")}
          >
            {course?.map((x, index) => (
              <div key={index} className="w-[21vw] shadow-lg p-2">
                <img src={x.thumbnail} className="h-[150px] object-cover" />
                <h2 className="text-xl font-semibold my-4">{x.title}</h2>
                <p className="text-gray-600 text-sm">{x.desc}</p>
                <Star rating={x.rating} size={"25px"} />
                <div className="text-right mr-4 mb-4">
                  <GiStairs className="inline-block text-xl" /> {x.level}
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-10 mr-10">
            <button
              className="bg-[#0689b6] hover:bg-[#068ab6cb] text-white px-4 py-2"
              onClick={() => navigate("/course")}
            >
              More Courses
            </button>
          </div>
        </div>
      </section>
      <section className="bg-[#0689b6] text-white py-16 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-8">
            Join thousands of learners on our platform today.
          </p>
          <button
            className="bg-white text-[#0689b6] px-6 py-2 rounded-full"
            onClick={() => navigate("/signup")}
          >
            Sign Up Now
          </button>
        </div>
      </section>
      <section>
        <div className="text-center mt-10">
          <h2 className="text-4xl text-gray-900 font-bold">
            Join Our Community
          </h2>
          <p className="text-gray-600 my-4">
            Enter your email address to register to our newsletter subscription
            delivered on regular basis!
          </p>
          <input
            type="text"
            placeholder="Enter Your Email"
            className="h-[7vh] w-[30vw] my-4 border px-2 border-gray-400 focus:outline-none"
          />
          <button className="block bg-[#0689b6] text-white text-md font-bold px-6 py-2 rounded-2xl mx-auto">
            SUBSCRIBE
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
