import React, { useEffect, useState } from "react";
import useQuiz from "../../Hooks/quizCustomHook";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingPage from "../loading page/loading";

const QuizPage = () => {
  const { contentId } = useParams();
  const studentId = useSelector((state) => state.user.id);
  const { getAllQuizzes, submitQuiz, quizzes } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllQuizzes(contentId);
  }, [contentId]);

  const handleOptionSelect = (questionId, option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]: option,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    submitQuiz(contentId, studentId, selectedOptions);
    setTimeout(() => {
      navigate(`/quiz-submit/${contentId}`);
    }, 2000);
  };

  return (
    <div>
      {loading && <LoadingPage />}
      <div className="flex justify-center">
        <div className="min-h-screen p-4 w-[50vw] shadow-lg px-12 ">
          <h2 className="text-2xl font-semibold mb-6">
            Quiz on {location.state.lessonName}
          </h2>
          {quizzes.length > 0 ? (
            <form
              onSubmit={handleSubmit}
              className="bg-slate-100 p-3 rounded-md"
            >
              {quizzes.map((quiz, index) => (
                <div key={quiz._id} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {index + 1}. {quiz.question}
                  </h3>
                  <ul className="list-none ml-6 space-y-2">
                    {quiz.options.map((option, optionIndex) => (
                      <li key={optionIndex} className="mb-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`quiz_${quiz._id}`}
                            value={option}
                            onChange={() =>
                              handleOptionSelect(quiz._id, option)
                            }
                            className="mr-2"
                          />
                          <span className="text-lg">{option}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <button
                type="submit"
                className="bg-[#0689b6] text-white px-4 py-2 w-[100%] rounded-md hover:bg-blue-600"
              >
                Submit Quiz
              </button>
            </form>
          ) : (
            "No Quiz Available"
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
