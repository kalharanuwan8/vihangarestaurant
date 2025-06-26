// src/components/charts/SalesBarChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const colors = ['#4F46E5','#10B981','#F59E0B','#EF4444','#6366F1','#14B8A6','#E879F9'];

const SalesBarChart = ({ salesData }) => {
  const dataByDate = salesData.reduce((acc, e) => {
    acc[e.date] = (acc[e.date] || 0) + e.price;
    return acc;
  }, {});
  const chartData = Object.entries(dataByDate).map(([date, amount]) => ({ date, amount }));
  
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Sales by Date</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date"/>
          <YAxis/>
          <Tooltip/>
          <Bar dataKey="amount">
            {chartData.map((_, idx) => <Cell key={idx} fill={colors[idx % colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesBarChart;
