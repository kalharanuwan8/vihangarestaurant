// LogsNew.jsx
import React, { useState } from 'react';

const dummyLogs = {
  admin: Array.from({ length: 30 }, (_, i) => {
    const baseTime = new Date(2025, 5, 20, 8, 30 + i); // June = 5
    const timestamp = baseTime.toTimeString().slice(0, 5);
    return {
      email: 'admin@example.com',
      timestamp: `2025-06-20 ${timestamp}`,
      action:
        i % 4 === 0
          ? 'Logged in'
          : i % 4 === 1
          ? `Added new item: Item ${i}`
          : i % 4 === 2
          ? `Deleted item: Item ${i}`
          : 'Logged out',
    };
  }),

  cashier: Array.from({ length: 30 }, (_, i) => {
    const baseTime = new Date(2025, 5, 20, 10, i); // June = 5
    const timestamp = baseTime.toTimeString().slice(0, 5);
    return {
      email: 'cashier1@example.com',
      timestamp: `2025-06-20 ${timestamp}`,
      action:
        i % 3 === 0
          ? 'Logged in'
          : i % 3 === 1
          ? `Billed item: Item ${i}`
          : `Held bill with ${i % 5 + 1} items`,
    };
  }),
};

const actionColors = {
  'Logged in': 'border-green-500 bg-green-50',
  'Logged out': 'border-gray-400 bg-gray-50',
  'Added': 'border-blue-500 bg-blue-50',
  'Deleted': 'border-red-500 bg-red-50',
  'Billed': 'border-yellow-500 bg-yellow-50',
  'Held': 'border-purple-500 bg-purple-50',
};

const LogsNew = () => {
  const [selectedUser, setSelectedUser] = useState('admin');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const logs = dummyLogs[selectedUser] || [];
  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;
  const currentLogs = logs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const getColor = (action) => {
    if (action.includes('Logged in') || action.includes('Logged out')) return actionColors['Logged in'];
    if (action.includes('Added')) return actionColors['Added'];
    if (action.includes('Deleted')) return actionColors['Deleted'];
    if (action.includes('Billed')) return actionColors['Billed'];
    if (action.includes('Held')) return actionColors['Held'];
    return 'border-indigo-500';
  };

  return (
    <div className="space-y-6">
      {/* User selection buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => { setSelectedUser('admin'); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-full text-base font-semibold shadow transition-all duration-200 ${
            selectedUser === 'admin'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-indigo-600 border border-indigo-600'
          }`}
        >
          Admin Logs
        </button>
        <button
          onClick={() => { setSelectedUser('cashier'); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-full text-base font-semibold shadow transition-all duration-200 ${
            selectedUser === 'cashier'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-indigo-600 border border-indigo-600'
          }`}
        >
          Cashier Logs
        </button>
      </div>

      {/* Log entries */}
      <div className="space-y-4">
        {currentLogs.map((log, index) => (
          <div
            key={index}
            className={`relative shadow rounded-lg p-6 border-l-4 group transform transition-all duration-300 hover:scale-105 ${getColor(log.action)} grid grid-cols-1 sm:grid-cols-3 gap-4 place-items-center`}
          >
            <div className="text-base font-semibold text-gray-800 group-hover:text-black transition-colors">
              🗓️ {log.timestamp}
            </div>
            <div className="text-base font-semibold text-gray-800 group-hover:text-black transition-colors">
              ✉️ {log.email}
            </div>
            <div className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors">
              📌 {log.action}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded text-base font-semibold transition-all duration-200 ${
              currentPage === i + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-indigo-600 border border-indigo-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LogsNew;
