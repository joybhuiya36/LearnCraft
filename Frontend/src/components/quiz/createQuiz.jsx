import React, { useState } from "react";
import useQuiz from "../../Hooks/quizCustomHook";

const CreateQuiz = ({ contentId, buttonClick }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const { createQuiz } = useQuiz();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const qusData = {
      contentId: contentId,
      question: question,
      options: options,
      answer: correctAnswer,
    };
    // console.log(qusData);
    createQuiz(qusData);
    buttonClick(true);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create Quiz Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-600"
          >
            Question:
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Options:
          </label>
          <div className="flex">
            {options.map((option, index) => (
              <div key={index} className="mr-4">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="correctAnswer"
            className="block text-sm font-medium text-gray-600"
          >
            Correct Answer:
          </label>
          <input
            type="text"
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#0689b6] text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
        >
          Create Question
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
