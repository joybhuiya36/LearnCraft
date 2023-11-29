import { useEffect } from "react";
import Header2 from "./components/header/header2";
import Header1 from "./components/header/header1";
import { Routes, Route } from "react-router-dom";
import Course from "./pages/course/course";
import CourseContent from "./pages/course/courseContent";
import Content from "./pages/content/content";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/form/login";
import SignUp from "./pages/form/signup";
import EmailVerificationSuccess from "./pages/verification/emailVerificationSuccess";
import NotFound from "./pages/invalid page/notFound";
import ResetPassword from "./pages/form/resetPass";
import InvalidToken from "./pages/invalid page/invalidToken";
import ForgetPassword from "./pages/form/forgetPass";
import AboutPage from "./pages/about/about";
import { useDispatch } from "react-redux";
import { setCount } from "./redux/slices/cartCountSlice";
import axiosIntance from "./utils/axiosInstance";
import CartPage from "./pages/cart/cartPage";
import { decodeToken, isExpired } from "react-jwt";
import { userLogout } from "./redux/slices/userSlice";
import { searchword } from "./redux/slices/searchSlice";
import WishlistPage from "./pages/wishlist/wishlistPage";
import DashboardPage from "./pages/dashboard/dashboard";
import Footer from "./components/footer/footer";
import IsAuthenticate from "./utils/isAuthenticate";
import IsStudent from "./utils/isStudent";
import HomePage from "./pages/homePage/homePage";
import EditCourse from "./pages/course/editCourse";
import AllQuizzes from "./pages/quiz/allQuizzes";
import QuizPage from "./pages/quiz/quizPage";
import SubmittedQuiz from "./pages/quiz/submiitedQuiz";
import IsAdmin from "./utils/isAdmin";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(searchword(""));
    const token = localStorage.getItem("token");
    if (!token) return;
    if (isExpired(token)) {
      dispatch(userLogout());
      return;
    }
    if (decodeToken(token).role != 3) return;
    axiosIntance("/cart/view")
      .then((res) => {
        dispatch(setCount(res.data.data.courses.length));
      })
      .catch((err) => {
        dispatch(setCount(0));
      });
  }, []);
  return (
    <>
      <Header1 />
      <Header2 />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course" element={<Course />} />
        <Route element={<IsAdmin />}>
          <Route path="/edit-course/:courseId" element={<EditCourse />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/course/:courseId" element={<CourseContent />} />
        <Route path="/about" element={<AboutPage />} />
        <Route element={<IsAuthenticate />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/all-quizzes/:contentId" element={<AllQuizzes />} />
          <Route path="/quiz/:contentId" element={<QuizPage />} />
          <Route path="/quiz-submit/:contentId" element={<SubmittedQuiz />} />
        </Route>
        <Route element={<IsStudent />}>
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
        <Route
          path="/verify-email/:token/:userId"
          element={<EmailVerificationSuccess />}
        />
        <Route
          path="/course/:courseId/content/:contentId"
          element={<Content />}
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/invalid-token" element={<InvalidToken />} />
        <Route
          path="/reset-password/:token/:userId"
          element={<ResetPassword />}
        />
        <Route
          path="/verify-email/:token/:userId"
          element={<EmailVerificationSuccess />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
