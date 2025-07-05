import React from 'react';
import { Home, BookOpen, User, LogOut, X } from 'lucide-react';
import NavItem from './NavItem';

const Sidebar = ({ view, navigate, onLogout, isSidebarOpen, setIsSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Табло', icon: Home },
    { id: 'courses', label: 'Обучение', icon: BookOpen },
    { id: 'profile', label: 'Профил', icon: User },
  ];
  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`absolute md:relative flex flex-col w-64 bg-white text-gray-700 shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 h-full`}>
        <div className="flex items-center justify-between p-4 border-b"><h1 className="text-2xl font-bold text-indigo-600">Homeo Learn</h1><button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-600 hover:text-gray-900"><X size={24} /></button></div>
        <nav className="flex-1 mt-6">{navItems.map(item => (<NavItem key={item.id} label={item.label} icon={item.icon} isActive={view.page === item.id} onClick={() => navigate({ page: item.id })} />))}</nav>
        <div className="p-4 border-t"><button onClick={onLogout} className="w-full flex items-center justify-center p-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-700 transition-colors"><LogOut className="mr-3" size={20} /><span>Изход</span></button></div>
      </aside>
    </>
  );
};

export default Sidebar; 