import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const QuizPage = ({ view, navigate, data }) => {
    const { courseId, quizId } = view;
    const quiz = data.quizzes[quizId];
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    if (!quiz) {
        return (
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <button onClick={() => navigate({ page: 'courseDetail', courseId })} className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center"><ArrowLeft size={16} className="mr-2" />Обратно към курса</button>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Тест</h2>
            <div className="lesson-content min-h-[300px] my-6 p-6 bg-gray-50 rounded-lg border flex items-center justify-center">
              <p className="text-gray-500 text-lg">Тестът за този урок все още се подготвя.</p>
            </div>
          </div>
        );
    }
    const totalQuestions = quiz.questions.length;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const handleSelectAnswer = (questionId, answerIndex) => { setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex })); };
    const handleSubmit = () => {
        let score = 0;
        quiz.questions.forEach(q => { if (selectedAnswers[q.id] === q.correctAnswer) score++; });
        navigate({ page: 'quizResult', score, totalQuestions, courseId });
    };
    const goToNext = () => { if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(prev => prev + 1); };
    const goToPrev = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1); };
    return (
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
        <p className="text-gray-500 mb-6 font-semibold">Въпрос {currentQuestionIndex + 1} от {totalQuestions}</p>
        <div className="my-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.text}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedAnswers[currentQuestion.id] === index ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-gray-200 hover:border-indigo-300'}`}>
                <input type="radio" name={`question-${currentQuestion.id}`} checked={selectedAnswers[currentQuestion.id] === index} onChange={() => handleSelectAnswer(currentQuestion.id, index)} className="hidden" />
                <span className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 ${selectedAnswers[currentQuestion.id] === index ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}></span>
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-8">
          <button onClick={goToPrev} disabled={currentQuestionIndex === 0} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">Предишен</button>
          {currentQuestionIndex === totalQuestions - 1 ? (
            <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Предай теста</button>
          ) : (
            <button onClick={goToNext} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Следващ</button>
          )}
        </div>
      </div>
    );
};

export default QuizPage; 