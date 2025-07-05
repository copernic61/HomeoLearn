import React from 'react';

const Card = ({ title, children, className }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    <div>{children}</div>
  </div>
);

export default Card; 