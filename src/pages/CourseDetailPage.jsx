import React, { useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, CheckCircle } from 'lucide-react';
import { getCourseProgress, getModuleProgress } from '../utils/courseUtils';

const TopicItem = ({ topic, navigate, courseId, moduleId }) => (
    <li className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center"><CheckCircle className={`mr-3 ${topic.completed ? 'text-green-500' : 'text-gray-300'}`} /><h4 className="font-semibold text-gray-800">{topic.title}</h4></div>
        <div className="mt-4 pl-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button onClick={() => navigate({ page: 'lesson', courseId, moduleId, topicId: topic.id })} className="flex-1 text-sm text-center bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200">Към урока</button>
            <button onClick={() => navigate({ page: 'quiz', courseId, quizId: topic.quizId })} className="flex-1 text-sm text-center bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg hover:bg-green-200">Започни тест</button>
            <button onClick={() => navigate({ page: 'discussion', courseId, discussionId: topic.discussionId })} className="flex-1 text-sm text-center bg-purple-100 text-purple-700 font-semibold py-2 px-4 rounded-lg hover:bg-purple-200">Въпроси и Отговори</button>
        </div>
    </li>
);

const ModuleAccordion = ({ module, isOpen, onToggle, navigate, courseId }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <button onClick={onToggle} className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{module.title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2" style={{maxWidth: '300px'}}>
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${getModuleProgress(module)}%` }}></div>
                </div>
            </div>
            <div className="flex items-center"><span className="text-gray-600 mr-4">{getModuleProgress(module)}%</span>{isOpen ? <ChevronDown /> : <ChevronRight />}</div>
        </button>
        {isOpen && (<div className="px-6 pb-6 border-t"><ul className="space-y-4 pt-4">{module.topics?.map(topic => (<TopicItem key={topic.id} topic={topic} navigate={navigate} courseId={courseId} moduleId={module.id} />))}</ul></div>)}
    </div>
);

const CourseDetailPage = ({ view, navigate, data }) => {
    const course = useMemo(() => data.courses.find(c => c.id === view.courseId), [view.courseId, data.courses]);
    const [openModuleId, setOpenModuleId] = useState(course?.modules?.[0]?.id || null);
    if (!course) return <div>Курсът не е намерен.</div>;
    return (
      <div>
        <button onClick={() => navigate({ page: 'courses' })} className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center"><ArrowLeft size={16} className="mr-2" />Обратно към всички курсове</button>
        <h2 className="text-3xl font-bold text-gray-800">{course.title}</h2>
        <div className="mt-2 mb-6">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-gray-700">Общ напредък</p>
            <p className="text-sm font-medium text-indigo-600">{getCourseProgress(course)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-green-500 h-4 rounded-full" style={{ width: `${getCourseProgress(course)}%` }}></div>
          </div>
        </div>
        <div className="space-y-4">
          {course.modules?.map(module => (
            <ModuleAccordion key={module.id} module={module} isOpen={openModuleId === module.id} onToggle={() => setOpenModuleId(openModuleId === module.id ? null : module.id)} navigate={navigate} courseId={course.id} />
          ))}
        </div>
      </div>
    );
};

export default CourseDetailPage; 