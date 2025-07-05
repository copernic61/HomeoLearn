import React from 'react';
import Card from '../components/Card';

const ProfilePage = ({ user }) => (
  <Card title="Потребителски профил">
    <div className="flex items-center space-x-6">
      <img className="h-24 w-24 rounded-full object-cover" src={user?.user_metadata?.avatar_url || `https://placehold.co/100x100/E2E8F0/4A5568?text=${user?.email?.[0]?.toUpperCase()}`} alt="User avatar" />
      <div>
        <h3 className="text-2xl font-bold text-gray-800">{user?.user_metadata?.full_name || 'Д-р Потребител'}</h3>
        <p className="text-gray-500">{user?.email}</p>
      </div>
    </div>
    <div className="mt-6 border-t pt-6">
      <h4 className="text-lg font-semibold mb-4">Постижения</h4>
      <div className="flex space-x-4">
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <p className="text-2xl font-bold text-indigo-600">0</p>
          <p className="text-sm text-gray-600">Завършени курсове</p>
        </div>
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <p className="text-2xl font-bold text-indigo-600">0</p>
          <p className="text-sm text-gray-600">Значки</p>
        </div>
      </div>
    </div>
  </Card>
);

export default ProfilePage; 