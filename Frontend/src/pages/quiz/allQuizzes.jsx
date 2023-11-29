import React, { useEffect, useState } from "react";
import useQuiz from "../../Hooks/quizCustomHook";
import { useLocation, useParams } from "react-router-dom";
import CreateQuiz from "../../components/quiz/createQuiz";
import { MdDeleteForever } from "react-icons/md";

const AllQuizzes = () => {
  const { contentId } = useParams();
  const location = useLocation();
  const { getAllQuizzes, deleteQuiz, quizzes } = useQuiz();
  const [addQus, setAddQus] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    getAllQuizzes(contentId);
  }, [quizzes]);
  const handleCreateButtton = (value) => {
    setAddQus(!value);
    getAllQuizzes(contentId);
  };
  const handleDeleteQus = (quizId) => {
    deleteQuiz(quizId);
    getAllQuizzes(contentId);
  };
  return (
    <div className="max-w-xl min-h-screen mx-auto p-6 bg-white rounded-md shadow-md">
      {location.state.isCreator && !addQus && (
        <div className="text-center">
          <button
            className="bg-[#0689b6] hover:bg-[#236fd3] rounded-lg mb-4 text-white py-2 px-[30%]"
            onClick={() => setAddQus(true)}
          >
            Add Quiz Question
          </button>
        </div>
      )}

      {addQus && (
        <div className="mb-8">
          <CreateQuiz contentId={contentId} buttonClick={handleCreateButtton} />
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes?.map((quiz, index) => (
            <div className="flex border p-4 rounded-md items-start">
              <li className="flex-1" key={quiz._id}>
                <h3 className="text-lg font-semibold mb-2">
                  {index + 1}. {quiz.question}
                </h3>
                <ul className="list-disc ml-6">
                  {quiz.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
                <p className="mt-2">Correct Answer: {quiz.answer}</p>
              </li>
              {location.state.isCreator && (
                <button onClick={() => handleDeleteQus(quiz._id)}>
                  <MdDeleteForever className="text-2xl hover:text-red-600" />
                </button>
              )}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllQuizzes;
