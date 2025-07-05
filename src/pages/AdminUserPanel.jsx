import React, { useEffect, useState } from 'react';
import { supabase } from '../App';

const AdminUserPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('user_profiles').select('id, full_name, role');
      if (!error) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const { error } = await supabase.from('user_profiles').update({ role: newRole }).eq('id', userId);
    if (!error) {
      setUsers(users => users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert('Грешка при смяна на роля: ' + error.message);
    }
  };

  if (loading) return <div>Зареждане на потребители...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Админ панел: Потребители и роли</h2>
      <table className="min-w-full bg-white border rounded-xl overflow-hidden">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Име</th>
            <th className="px-4 py-2 border-b">Роля</th>
            <th className="px-4 py-2 border-b">Смени роля</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="px-4 py-2 border-b text-xs">{u.id}</td>
              <td className="px-4 py-2 border-b">{u.full_name || '(няма име)'}</td>
              <td className="px-4 py-2 border-b">{u.role}</td>
              <td className="px-4 py-2 border-b">
                <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} className="border rounded px-2 py-1">
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="teacher">teacher</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserPanel; 