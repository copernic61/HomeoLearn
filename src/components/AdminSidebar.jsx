import React from 'react';
import { Home, BookUser } from 'lucide-react';

const AdminSidebar = ({ view, navigate }) => {
    const navItems = [
        { id: 'adminDashboard', label: 'Админ Табло', icon: Home },
        { id: 'adminManageCourses', label: 'Управление на курсове', icon: BookUser },
    ];
    return (
        <aside className="flex flex-col w-64 bg-slate-800 text-slate-100 shadow-xl h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </div>
            <nav className="flex-1 mt-6">
                {navItems.map(item => (
                    <a href="#" key={item.id} onClick={() => navigate({ page: item.id })} className={`flex items-center px-6 py-3 mx-2 my-1 text-base font-medium rounded-lg transition-colors ${view.page === item.id ? 'bg-indigo-600' : 'hover:bg-slate-700'}`}>
                        <item.icon className="mr-4" size={20} />
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar; 