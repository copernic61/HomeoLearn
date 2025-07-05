import React from 'react';
import Card from '../components/Card';
import { getCourseProgress } from '../utils/courseUtils';

const DashboardPage = ({ data }) => {
    const coursesInProgress = data.courses.filter(c => getCourseProgress(c) > 0 && getCourseProgress(c) < 100);
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Вашето табло</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Продължете откъдето спряхте">
              {coursesInProgress.length > 0 ? coursesInProgress.map(course => (
                <div key={course.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-gray-700">{course.title}</p>
                    <p className="text-sm font-medium text-indigo-600">{getCourseProgress(course)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${getCourseProgress(course)}%` }}></div>
                  </div>
                </div>
              )) : <p className="text-gray-500">Нямате започнати курсове. Моля, заредете примерните данни от бутона в хедъра.</p>}
            </Card>
          </div>
          <Card title="Последни резултати от изпити">
            <p className="text-gray-500">Тук ще се показват последните ви резултати.</p>
          </Card>
        </div>
      </div>
    );
};

export default DashboardPage; 