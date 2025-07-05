import React from 'react';

const NavItem = ({ label, icon: Icon, isActive, onClick }) => (
  <a href="#" onClick={onClick} className={`flex items-center px-6 py-3 mx-2 my-1 text-base font-medium rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}>
    <Icon className="mr-4" size={20} />
    <span>{label}</span>
  </a>
);

export default NavItem; 