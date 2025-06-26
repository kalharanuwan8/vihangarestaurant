// src/components/charts/TopProductsPieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const colors = ['#4F46E5','#10B981','#F59E0B','#EF4444','#6366F1','#14B8A6','#E879F9'];

const TopProductPieChart = ({ salesData }) => {
  const map = salesData.reduce((acc, e) => {
    acc[e.name] = (acc[e.name] || 0) + e.price;
    return acc;
  }, {});
  const pie = Object.entries(map).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Top Products</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {pie.map((_, idx)=><Cell key={idx} fill={colors[idx % colors.length]}/>)}
          </Pie>
          <Tooltip/>
          <Legend/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductPieChart;
