import React from 'react';
import { Shield } from 'lucide-react';

const Header = ({ user, isAdminMode, onToggleAdminMode }) => {
    // Вземи име: ако няма full_name, вземи частта преди @ от email
    const email = user?.user?.email || '';
    const fullName = user?.user?.user_metadata?.full_name || (email ? email.split('@')[0] : '');
    return (
        <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
            <div className="flex-1"></div>
            <div className="flex items-center">
                <button onClick={onToggleAdminMode} title={isAdminMode ? "Изглед за курсисти" : "Административен режим"} className={`mr-4 p-2 rounded-full hover:bg-gray-200 ${isAdminMode ? 'bg-indigo-100 text-indigo-600' : ''}`}><Shield size={20}/></button>
                <span className="text-right mr-4 hidden sm:block">
                    <span className="font-semibold">{fullName}</span><br />
                    <span className="text-sm text-gray-500">{email}</span>
                </span>
                <img className="h-12 w-12 rounded-full object-cover" src={user?.user?.user_metadata?.avatar_url || `https://placehold.co/100x100/E2E8F0/4A5568?text=${email?.[0]?.toUpperCase()}`} alt="User avatar" />
            </div>
        </header>
    );
};

export default Header; 