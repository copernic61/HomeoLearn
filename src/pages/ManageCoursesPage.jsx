import React, { useState } from 'react';

const ManageCoursesPage = ({ courses, onCreate, onDelete, onEdit, loading, navigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('📚');
  const [editModal, setEditModal] = useState(null); // {id, title, icon}
  const [editTitle, setEditTitle] = useState('');
  const [editIcon, setEditIcon] = useState('📚');

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    onCreate({ title: newTitle, icon: newIcon, modules: [] });
    setShowModal(false);
    setNewTitle('');
    setNewIcon('📚');
  };

  const openEdit = (course) => {
    setEditModal(course);
    setEditTitle(course.title);
    setEditIcon(course.icon || '📚');
  };

  const handleEdit = () => {
    if (!editTitle.trim()) return;
    onEdit({ ...editModal, title: editTitle, icon: editIcon });
    setEditModal(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Управление на курсове</h2>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">+ Нов курс</button>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4">
        {loading ? <div>Зареждане...</div> : (
          <ul className="divide-y divide-gray-200">
            {courses.map(course => (
              <li key={course.id} className="flex items-center justify-between py-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-xl">{course.icon || '📚'}</span>
                  </div>
                  <span className="text-lg font-semibold">{course.title}</span>
                  <span className="text-sm text-gray-500 ml-2">(ID: {course.id})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(course)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">Редактирай</button>
                  <button onClick={() => navigate({ page: 'adminEditCourse', courseId: course.id })} className="p-2 text-green-600 hover:bg-green-100 rounded-full">Редактирай съдържание</button>
                  <button onClick={() => { if(window.confirm('Сигурни ли сте?')) onDelete(course.id); }} className="p-2 text-red-600 hover:bg-red-100 rounded-full">Изтрий</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Нов курс</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Заглавие</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Икона</label>
              <input type="text" value={newIcon} onChange={e => setNewIcon(e.target.value)} className="w-full px-4 py-2 border rounded-lg" maxLength={2} />
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Отказ</button>
              <button onClick={handleCreate} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">Създай</button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Редакция на курс</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Заглавие</label>
              <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Икона</label>
              <input type="text" value={editIcon} onChange={e => setEditIcon(e.target.value)} className="w-full px-4 py-2 border rounded-lg" maxLength={2} />
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setEditModal(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Отказ</button>
              <button onClick={handleEdit} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">Запази</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoursesPage; 