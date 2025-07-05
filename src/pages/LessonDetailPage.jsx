import React, { useState } from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LessonDetailPage = ({ view, navigate, data }) => {
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const { courseId, moduleId, topicId } = view;
    const course = data.courses.find(c => c.id === courseId);
    const module = course?.modules?.find(m => m.id === moduleId);
    const topic = module?.topics?.find(t => t.id === topicId);

    if (!topic || !topic.lessonParts || topic.lessonParts.length === 0) {
         return (
           <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
             <button onClick={() => navigate({ page: 'courseDetail', courseId })} className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center"><ArrowLeft size={16} className="mr-2" />Обратно към курса</button>
             <h2 className="text-3xl font-bold text-gray-800 mb-2">{topic?.title || 'Урок'}</h2>
             <div className="lesson-content min-h-[300px] my-6 p-6 bg-gray-50 rounded-lg border flex items-center justify-center">
               <p className="text-gray-500 text-lg">Съдържанието за този урок все още се подготвя.</p>
             </div>
           </div>
         );
    }
    const currentPart = topic.lessonParts[currentPartIndex];
    const totalParts = topic.lessonParts.length;
    const goToNextPart = () => { if (currentPartIndex < totalParts - 1) setCurrentPartIndex(currentPartIndex + 1); };
    const goToPrevPart = () => { if (currentPartIndex > 0) setCurrentPartIndex(currentPartIndex - 1); };
    return (
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <button onClick={() => navigate({ page: 'courseDetail', courseId })} className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center"><ArrowLeft size={16} className="mr-2" />Обратно към курса</button>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{topic.title}</h2>
        <p className="text-gray-500 mb-6 font-semibold">Част {currentPartIndex + 1} от {totalParts}</p>
        <div className="lesson-content min-h-[300px] my-6 p-6 bg-gray-50 rounded-lg border">
          {currentPart.type === 'text' && (
            <div
              className="prose max-w-none text-gray-700 leading-relaxed prose-h1:block"
              dangerouslySetInnerHTML={{ __html: currentPart.content }}
            />
          )}
          {currentPart.type === 'video' && (
            <div className="bg-black rounded-lg aspect-video flex flex-col items-center justify-center text-white">
              <PlayCircle size={64} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-bold">{currentPart.title}</h3>
              <p className="text-gray-300">Симулация на видео плейър</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-8">
          <button onClick={goToPrevPart} disabled={currentPartIndex === 0} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">Предишна част</button>
          <span className="text-gray-600">{currentPartIndex + 1} / {totalParts}</span>
          <button onClick={goToNextPart} disabled={currentPartIndex === totalParts - 1} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-indigo-300 disabled:cursor-not-allowed">Следваща част</button>
        </div>
      </div>
    );
};

export default LessonDetailPage; 