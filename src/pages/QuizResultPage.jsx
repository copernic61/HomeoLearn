import React from 'react';
import { Award, ArrowLeft } from 'lucide-react';

const QuizResultPage = ({ view, navigate }) => {
    const { score, totalQuestions, courseId } = view;
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center">
        <Award size={80} className="mx-auto text-yellow-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Тестът е завършен!</h2>
        <p className="text-gray-600 text-lg mb-6">Вашият резултат:</p>
        <p className="text-6xl font-bold text-indigo-600 my-4">{score} / {totalQuestions}</p>
        <p className="text-2xl font-semibold text-gray-700">({percentage}%)</p>
        <button onClick={() => navigate({ page: 'courseDetail', courseId })} className="mt-8 w-full max-w-xs mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg">Обратно към курса</button>
      </div>
    );
};

export default QuizResultPage; 