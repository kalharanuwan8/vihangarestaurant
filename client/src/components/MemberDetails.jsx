import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MemberDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      alert('User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 w-full h-auto">
      <div className="max-w-7xl mx-auto bg-white p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">
          All Members
        </h1>

        {loading ? (
          <p className="text-gray-600 text-center text-lg">Loading user data...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No users found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full table-auto bg-white text-sm">
              <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-3 border-t border-gray-100 text-gray-700">{index + 1}</td>
                    <td className="px-6 py-3 border-t border-gray-100 text-gray-800 font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-3 border-t border-gray-100">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isAdmin
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.isAdmin ? 'Admin' : 'Cashier'}
                      </span>
                    </td>
                    <td className="px-6 py-3 border-t border-gray-100">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetails;
