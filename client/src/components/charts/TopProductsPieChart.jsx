import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Reused dummy sales data
const dummySales = [
  { id: 1, name: 'Espresso', category: 'Beverage', price: 150, date: '2025-06-15' },
  { id: 2, name: 'Latte', category: 'Beverage', price: 250, date: '2025-06-15' },
  { id: 3, name: 'Pasta Alfredo', category: 'Food', price: 450, date: '2025-06-14' },
  { id: 4, name: 'Blueberry Muffin', category: 'Bakery', price: 160, date: '2025-06-13' },
  { id: 5, name: 'Chicken Sandwich', category: 'Food', price: 350, date: '2025-06-10' },
  { id: 6, name: 'Cinnamon Roll', category: 'Bakery', price: 200, date: '2025-06-08' },
];

// Group by product name and total sales
const productSalesMap = dummySales.reduce((acc, item) => {
  if (!acc[item.name]) {
    acc[item.name] = 0;
  }
  acc[item.name] += item.price;
  return acc;
}, {});

// Convert to chart-ready array
const pieData = Object.entries(productSalesMap).map(([name, value]) => ({
  name,
  value
}));

// Color palette (same as used previously)
const pieColors = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Violet
  '#14B8A6', // Teal
  '#E879F9', // Pink
];

const TopProductPieChart = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Top-Selling Products</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductPieChart;
