import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Sample dummy data
const salesData = [
  { date: '2025-06-08', amount: 200 },
  { date: '2025-06-10', amount: 350 },
  { date: '2025-06-13', amount: 160 },
  { date: '2025-06-14', amount: 450 },
  { date: '2025-06-15', amount: 400 }, // multiple items on this date, you can group by date in real use
  { date: '2025-06-16', amount: 300 },
  { date: '2025-06-17', amount: 550 },
];

// 7-color palette
const barColors = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Violet
  '#14B8A6', // Teal
  '#E879F9', // Pink
];

const SalesBarChart = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Sales Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount">
            {salesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesBarChart;
