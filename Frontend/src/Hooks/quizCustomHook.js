import { useState } from "react";
import axiosIntance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const useQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [submitData, setSubmitData] = useState({});
  const getAllQuizzes = (contentId) => {
    axiosIntance(`/content/view/${contentId}`)
      .then((res) => {
        setQuizzes(res.data.data.quiz);
      })
      .catch((err) => setQuizzes([]));
  };
  const createQuiz = (data) => {
    axiosIntance
      .post("/quiz/create", data)
      .then((res) => toast.success("Quiz is Created Successfully!"))
      .catch((err) => toast.error("Failed to Create Quiz"));
  };
  const deleteQuiz = (quizId) => {
    axiosIntance
      .delete(`/quiz/delete/${quizId}`)
      .then((res) => toast.success("Quiz Question is Successfully Deleted!"))
      .catch((err) => toast.error("Failed to Delete Quiz Question!"));
  };
  const submitQuiz = (contentId, studentId, submission) => {
    axiosIntance
      .post("/quiz/submit", { contentId, studentId, submission })
      .then((res) => toast.success("Quiz is Submitted Successfully!"))
      .catch((err) => toast.error("Failed to Submit Quiz!"));
  };
  const viewSubmission = (contentId, studentId) => {
    setTimeout(() => {
      axiosIntance(`/quiz/submitted-quiz/${contentId}/${studentId}`).then(
        (res) => {
          setSubmitData(res.data.data.submission);
        }
      );
    }, 1000);
  };
  return {
    quizzes,
    getAllQuizzes,
    createQuiz,
    deleteQuiz,
    submitQuiz,
    submitData,
    viewSubmission,
  };
};

export default useQuiz;
