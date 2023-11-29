import React, { useEffect, useState } from "react";
import useQuiz from "../../Hooks/quizCustomHook";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingPage from "../loading page/loading";

const SubmittedQuiz = () => {
  const { contentId } = useParams();
  const studentId = useSelector((state) => state.user.id);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { getAllQuizzes, viewSubmission, quizzes, submitData } = useQuiz();

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllQuizzes(contentId);
    viewSubmission(contentId, studentId);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setCount((prevCount) => {
      let newCount = prevCount;
      quizzes.forEach((quiz) => {
        const submittedAnswer = submitData[quiz._id];
        const correctAnswer = quiz.answer;
        if (submittedAnswer === correctAnswer) newCount++;
      });
      return newCount;
    });
  }, [quizzes, submitData]);
  const getAnswerClass = (quiz) => {
    const submittedAnswer = submitData[quiz._id];
    const correctAnswer = quiz.answer;
    return submittedAnswer === correctAnswer ? "bg-green-200" : "bg-red-200";
  };

  return (
    <div>
      {loading && <LoadingPage />}
      <div className="min-h-screen p-4">
        <div className="w-[55vw] shadow-lg p-[5vw] mx-auto">
          <h3 className="text-2xl font-bold mb-4">Quiz Result</h3>
          <p className="mb-8 text-xl font-bold">
            Correct Answer: {count}/{quizzes.length}
          </p>
          {quizzes.map((quiz, index) => (
            <div
              key={quiz._id}
              className={`mb-6 p-4 rounded-md ${getAnswerClass(quiz)}`}
            >
              <h3 className="text-lg font-semibold mb-2">
                {index + 1}. {quiz.question}
              </h3>
              <ul className="list-none ml-6 space-y-2">
                {quiz.options.map((option, index) => (
                  <li key={index} className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value={option}
                        checked={submitData[quiz._id] == option}
                        disabled
                      />
                      <span className="text-lg ml-2">{option}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmittedQuiz;
