import React from 'react';
import { getCourseProgress } from '../utils/courseUtils';

const CoursesListPage = ({ navigate, courses }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Обучителни курсове</h2>
    {courses.length === 0 ? (
      <p className="text-gray-500">Няма налични курсове. Моля, заредете примерните данни от бутона в хедъра.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          const progress = getCourseProgress(course);
          return (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-xl">{course.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm text-gray-500 text-right">{progress}% завършен</p>
              </div>
              <div className="p-6 pt-0">
                <button onClick={() => navigate({ page: 'courseDetail', courseId: course.id })} className="mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">{progress > 0 ? 'Продължи' : 'Започни'}</button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default CoursesListPage; 