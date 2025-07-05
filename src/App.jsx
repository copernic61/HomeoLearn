 import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AdminSidebar from './components/AdminSidebar';
import DashboardPage from './pages/DashboardPage';
import CoursesListPage from './pages/CoursesListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonDetailPage from './pages/LessonDetailPage';
import QuizPage from './pages/QuizPage';
import QuizResultPage from './pages/QuizResultPage';
import DiscussionChatPage from './pages/DiscussionChatPage';
import ExamsPage from './pages/ExamsPage';
import ProfilePage from './pages/ProfilePage';
import AdminUserPanel from './pages/AdminUserPanel';
import ManageCoursesPage from './pages/ManageCoursesPage';
import EditCoursePage from './pages/EditCoursePage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- LoginPage (оставям го тук, защото е малък и специфичен) ---
const LoginPage = ({ auth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
            if (loginError) throw loginError;
        } catch (err) {
            setError('Грешен имейл или парола.');
        }
        setLoading(false);
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) throw signUpError;
            // Автоматичен login след регистрация
            await supabase.auth.signInWithPassword({ email, password });
        } catch (err) {
            setError(err.message || 'Грешка при регистрация.');
        }
        setLoading(false);
    };
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-indigo-600">Homeo Learn</h1>
                    <p className="text-gray-500 mt-2">Вашата врата към знанието</p>
                </div>
                <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Имейл</label>
                        <input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Парола</label>
                        <input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-60" type="submit" disabled={loading}>{mode === 'login' ? 'Вход' : 'Регистрация'}</button>
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-6">
                        {mode === 'login' ? (
                            <>Нямате акаунт? <button type="button" className="font-bold text-indigo-600 hover:text-indigo-800" onClick={() => { setMode('register'); setError(''); }}>Регистрирайте се</button></>
                        ) : (
                            <>Имате акаунт? <button type="button" className="font-bold text-indigo-600 hover:text-indigo-800" onClick={() => { setMode('login'); setError(''); }}>Вход</button></>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

// --- Seed Admin User ---
async function seedAdminUser() {
  const adminEmail = 'admin@homeolearn.bg';
  const adminPassword = 'admin1234';
  // Проверка дали съществува
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return alert('Грешка при проверка за админ: ' + error.message);
  const exists = data.users.some(u => u.email === adminEmail);
  if (!exists) {
    const { error: regErr } = await supabase.auth.admin.createUser({ email: adminEmail, password: adminPassword, email_confirm: true, user_metadata: { role: 'admin', full_name: 'Администратор' } });
    if (regErr) return alert('Грешка при създаване на админ: ' + regErr.message);
    alert('Админ потребител създаден: ' + adminEmail + ' / ' + adminPassword);
  } else {
    alert('Админ потребител вече съществува.');
  }
}

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState({});
  const [view, setView] = useState({ page: 'dashboard' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // --- Supabase Auth ---
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session);
      setLoading(false);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- Fetch Data ---
  useEffect(() => {
    if (user) {
      setLoading(true);
      const fetchData = async () => {
        const { data: coursesData, error: coursesError } = await supabase.from('courses').select('*');
        if (coursesError) {
          console.error("Supabase (Courses) Error:", coursesError);
          setLoading(false);
          return;
        }
        setCourses(coursesData);
        const { data: quizzesData, error: quizzesError } = await supabase.from('quizzes').select('*');
        if (quizzesError) {
          console.error("Supabase (Quizzes) Error:", quizzesError);
          setLoading(false);
          return;
        }
        setQuizzes(quizzesData);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);
  
  const navigate = (newView) => { 
      if (isAdminMode && !newView.page.startsWith('admin')) {
          return;
      }
      setView(newView);
      if (isSidebarOpen) setIsSidebarOpen(false); 
  };
  
  const toggleAdminMode = () => {
      const newAdminState = !isAdminMode;
      setIsAdminMode(newAdminState);
      if (newAdminState) {
          setView({ page: 'adminDashboard' });
      } else {
          setView({ page: 'dashboard' });
      }
  };

  const handleSaveLesson = async (courseId, moduleId, topicId, newLessonParts) => {
        const courseToUpdate = courses.find(c => c.id === courseId);
        if (!courseToUpdate) return;
        const updatedModules = courseToUpdate.modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    topics: m.topics.map(t => t.id === topicId ? { ...t, lessonParts: newLessonParts } : t)
                }
            }
            return m;
        });
        const { error } = await supabase.from('courses').update({ modules: updatedModules }).eq('id', courseId);
        if (error) alert('Грешка при запис на урок: ' + error.message);
  };

  const seedDatabase = async () => {
    setIsSeeding(true);
    const mockData = {
      courses: [ { id: "1", title: 'Основи на клиничната хомеопатия', icon: 'H', modules: [ { id: "101", title: 'Модул 1: Принципи и история', topics: [ { id: "1011", title: 'История на хомеопатията', completed: true, quizId: 'q1011', discussionId: 'd1011', lessonParts: [{id: 'lp_1011_1', type: 'text', content: 'Съдържание за историята...'}] }, { id: "1012", title: 'Закон за подобието', completed: true, quizId: 'q1012', discussionId: 'd1012', lessonParts: [{id: 'lp_1012_1', type: 'text', content: 'Съдържание за закона за подобието...'}] }, { id: "1013", title: 'Динамизация и разреждане', completed: false, quizId: 'q1013', discussionId: 'd1013', lessonParts: [] }, ] }, ] }, { id: "4", title: 'Materia Medica: Arnica montana', icon: 'A', modules: [ { id: "401", title: 'Модул 1: Ключови симптоми и приложения', topics: [ { id: "4011", title: 'Произход и основни характеристики', completed: false, quizId: 'q4011', discussionId: 'd4011', lessonParts: [ { id: 'lp_4011_1', type: 'text', content: 'Arnica montana е многогодишно тревисто растение...'}, { id: 'lp_4011_2', type: 'video', url: 'placeholder_video_url', title: 'Видео: Събиране и обработка на Arnica' }, { id: 'lp_4011_3', type: 'text', content: 'Основните активни съставки са сесквитерпенови лактони...'} ] }, { id: "4012", title: 'Приложение при травми и контузии', completed: false, quizId: 'q4012', discussionId: 'd4012', lessonParts: [] }, ] } ] } ],
      quizzes: { 'q4011': { title: 'Тест: Произход и основни характеристики на Arnica', questions: [ { id: 1, text: 'Към кое семейство принадлежи Arnica montana?', options: ['Розоцветни (Rosaceae)', 'Сложноцветни (Asteraceae)', 'Картофови (Solanaceae)'], correctAnswer: 1 }, { id: 2, text: 'Коя е основната активна съставка в Arnica?', options: ['Салицин', 'Кофеин', 'Хеленалин'], correctAnswer: 2 }, { id: 3, text: 'Коя част от растението се използва?', options: ['Само цветовете', 'Само корените', 'Цялото растение'], correctAnswer: 2 } ] } },
    };
    for (const course of mockData.courses) {
      await supabase.from('courses').upsert(course);
    }
    for (const [quizId, quizData] of Object.entries(mockData.quizzes)) {
      await supabase.from('quizzes').upsert({ id: quizId, ...quizData });
    }
    setIsSeeding(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg">Установяване на връзка...</div>;
  }

  if (!user) {
    return <LoginPage auth={supabase.auth} />;
  }

  const fullData = { user, courses, quizzes };

  const addMessageToDiscussion = async (discussionId, message) => {
    const { error } = await supabase.from('messages').insert({ ...message, discussion_id: discussionId });
    if (error) alert('Грешка при добавяне на съобщение: ' + error.message);
  };

  // --- Admin Page Content ---
  const handleCreateCourse = async (course) => {
    const { error } = await supabase.from('courses').insert(course);
    if (error) alert('Грешка при създаване на курс: ' + error.message);
    else setCourses(await (await supabase.from('courses').select('*')).data);
  };
  const handleDeleteCourse = async (courseId) => {
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (error) alert('Грешка при триене: ' + error.message);
    else setCourses(await (await supabase.from('courses').select('*')).data);
  };
  const handleEditCourse = async (course) => {
    const { id, ...rest } = course;
    const { error } = await supabase.from('courses').update(rest).eq('id', id);
    if (error) alert('Грешка при редакция: ' + error.message);
    else setCourses(await (await supabase.from('courses').select('*')).data);
  };
  const AdminPageContent = ({ view, navigate, data, onSaveLesson }) => {
    switch (view.page) {
      case 'adminDashboard':
        return <div className="p-8"><h2 className="text-2xl font-bold">Добре дошли в административния панел!</h2><p>От тук можете да управлявате съдържанието на платформата. Използвайте менюто вляво, за да навигирате.</p></div>;
      case 'adminManageCourses':
        return <ManageCoursesPage courses={courses} onCreate={handleCreateCourse} onDelete={handleDeleteCourse} onEdit={handleEditCourse} loading={loading} navigate={navigate} />;
      case 'adminEditCourse':
        return <EditCoursePage courseId={view.courseId} courses={courses} navigate={navigate} setCourses={setCourses} />;
      case 'adminEditLesson':
        return <div>Edit Lesson Page (TODO)</div>;
      case 'adminUserPanel':
        return <AdminUserPanel />;
      default:
        return <div>Админ табло</div>;
    }
  };

  // --- Page Content ---
  const PageContent = ({ view, navigate, data }) => {
    switch (view.page) {
      case 'dashboard': return <DashboardPage data={data} />;
      case 'courses': return <CoursesListPage navigate={navigate} courses={data.courses} />;
      case 'courseDetail': return <CourseDetailPage view={view} navigate={navigate} data={data} />;
      case 'lesson': return <LessonDetailPage view={view} navigate={navigate} data={data} />;
      case 'quiz': return <QuizPage view={view} navigate={navigate} data={data} />;
      case 'quizResult': return <QuizResultPage view={view} navigate={navigate} />;
      case 'discussion': return <DiscussionChatPage view={view} data={fullData} onAddMessage={addMessageToDiscussion} currentUser={user?.user} />;
      case 'exams': return <ExamsPage />;
      case 'profile': return <ProfilePage user={data.user} />;
      default: return <DashboardPage data={data} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {isAdminMode ? (
        <AdminSidebar view={view} navigate={navigate} />
      ) : (
        <Sidebar view={view} navigate={navigate} onLogout={() => supabase.auth.signOut()} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} isAdminMode={isAdminMode} onToggleAdminMode={toggleAdminMode} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {isAdminMode ? (
            <AdminPageContent view={view} navigate={navigate} data={fullData} onSaveLesson={handleSaveLesson} />
          ) : (
            <PageContent view={view} navigate={navigate} data={fullData} />
          )}
        </main>
      </div>
    </div>
  );
}
