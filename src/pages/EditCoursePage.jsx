import React, { useState, useMemo } from 'react';
import { supabase } from '../App';
import ReactMarkdown from 'react-markdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditCoursePage = ({ courseId, courses, navigate, setCourses }) => {
  const originalCourse = useMemo(() => courses.find(c => c.id === courseId), [courseId, courses]);
  const [editedCourse, setEditedCourse] = useState(() => JSON.parse(JSON.stringify(originalCourse)));
  const [saving, setSaving] = useState(false);

  if (!editedCourse) return <div>Курсът не е намерен.</div>;

  const handleAddModule = () => {
    const title = prompt('Заглавие на новия модул:');
    if (title) {
      setEditedCourse(prev => ({
        ...prev,
        modules: [...(prev.modules || []), { id: Date.now().toString(), title, topics: [] }]
      }));
    }
  };
  const handleDeleteModule = (moduleId) => {
    if (window.confirm('Изтриване на модул и всички теми?')) {
      setEditedCourse(prev => ({
        ...prev,
        modules: prev.modules.filter(m => m.id !== moduleId)
      }));
    }
  };
  const handleAddTopic = (moduleId) => {
    const title = prompt('Заглавие на новата тема:');
    if (title) {
      setEditedCourse(prev => ({
        ...prev,
        modules: prev.modules.map(m => m.id === moduleId ? {
          ...m,
          topics: [...(m.topics || []), {
            id: Date.now().toString(),
            title,
            completed: false,
            lessonParts: [],
            quizId: `q_${Date.now()}`,
            discussionId: `d_${Date.now()}`
          }]
        } : m)
      }));
    }
  };
  const handleDeleteTopic = (moduleId, topicId) => {
    if (window.confirm('Изтриване на тема?')) {
      setEditedCourse(prev => ({
        ...prev,
        modules: prev.modules.map(m => m.id === moduleId ? {
          ...m,
          topics: m.topics.filter(t => t.id !== topicId)
        } : m)
      }));
    }
  };
  const handleLessonChange = (moduleId, topicId, idx, value) => {
    setEditedCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === moduleId ? {
        ...m,
        topics: m.topics.map(t => t.id === topicId ? {
          ...t,
          lessonParts: t.lessonParts.map((lp, i) => i === idx ? { ...lp, content: value } : lp)
        } : t)
      } : m)
    }));
  };
  const handleAddLessonPart = (moduleId, topicId) => {
    setEditedCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === moduleId ? {
        ...m,
        topics: m.topics.map(t => t.id === topicId ? {
          ...t,
          lessonParts: [...(t.lessonParts || []), { id: Date.now().toString(), type: 'text', content: '' }]
        } : t)
      } : m)
    }));
  };
  const handleDeleteLessonPart = (moduleId, topicId, idx) => {
    setEditedCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === moduleId ? {
        ...m,
        topics: m.topics.map(t => t.id === topicId ? {
          ...t,
          lessonParts: t.lessonParts.filter((_, i) => i !== idx)
        } : t)
      } : m)
    }));
  };
  const handleSave = async () => {
    setSaving(true);
    console.log('Записваме modules:', editedCourse.modules);
    const { error } = await supabase.from('courses').update({ modules: editedCourse.modules }).eq('id', editedCourse.id);
    if (error) {
      console.error('Supabase update error:', error);
      alert('Грешка при запис: ' + error.message);
    }
    if (!error) {
      const { data: newCourses } = await supabase.from('courses').select('*');
      setCourses(newCourses);
    }
    setSaving(false);
    navigate({ page: 'adminManageCourses' });
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Редакция на съдържание: {editedCourse.title}</h2>
        <button onClick={() => navigate({ page: 'adminManageCourses' })} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Назад</button>
      </div>
      <div className="mb-6">
        <button onClick={handleAddModule} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">+ Нов модул</button>
      </div>
      {editedCourse.modules?.map(module => (
        <div key={module.id} className="mb-8 border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{module.title}</h3>
            <button onClick={() => handleDeleteModule(module.id)} className="text-red-600">Изтрий модул</button>
          </div>
          <button onClick={() => handleAddTopic(module.id)} className="bg-green-600 text-white font-bold py-1 px-3 rounded mb-4">+ Нова тема</button>
          {module.topics?.map(topic => (
            <div key={topic.id} className="mb-4 border rounded p-3 bg-white">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{topic.title}</h4>
                <button onClick={() => handleDeleteTopic(module.id, topic.id)} className="text-red-600">Изтрий тема</button>
              </div>
              <div className="mb-2">
                <strong>Lesson parts:</strong>
                {topic.lessonParts?.map((lp, idx) => (
                  <div key={lp.id} className="flex gap-2 items-center mt-2">
                    <ReactQuill
                      value={lp.content}
                      onChange={value => handleLessonChange(module.id, topic.id, idx, value)}
                      theme="snow"
                      className="w-full"
                    />
                    <button onClick={() => handleDeleteLessonPart(module.id, topic.id, idx)} className="text-red-500">Изтрий</button>
                  </div>
                ))}
                <button onClick={() => handleAddLessonPart(module.id, topic.id)} className="text-xs bg-blue-500 text-white rounded px-2 py-1 mt-2">+ Добави част</button>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="flex gap-4 mt-8">
        <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg">{saving ? 'Запис...' : 'Запази всички промени'}</button>
        <button onClick={() => navigate({ page: 'adminManageCourses' })} className="bg-gray-400 text-white font-bold py-2 px-6 rounded-lg">Отказ</button>
      </div>
    </div>
  );
};

export default EditCoursePage; 