import React, { useState, useEffect, useMemo } from 'react';
import axios from '../api/axios';
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import SalesBarChart from '../components/charts/SalesBarChart';
import TopProductPieChart from '../components/charts/TopProductsPieChart';

const StatCard = ({ title, value, icon: Icon, color }) => {
  const variants = {
    blue: { border: 'border-blue-500', bg: 'hover:bg-blue-500' },
    green: { border: 'border-green-500', bg: 'hover:bg-green-500' },
    yellow: { border: 'border-yellow-500', bg: 'hover:bg-yellow-500' },
    purple: { border: 'border-purple-500', bg: 'hover:bg-purple-500' },
  };
  const clr = variants[color] || variants.blue;

  return (
    <div className={`group bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 transition-all duration-300 ${clr.border} ${clr.bg}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs sm:text-sm font-medium uppercase">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold">{value}</p>
        </div>
        <div className="p-2 sm:p-3 bg-gray-100 rounded-full">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    axios.get('/bills')
      .then(res => setBills(res.data))
      .catch(console.error);
  }, []);

  const salesAggregated = useMemo(() => {
    const map = {};

    bills.forEach(bill => {
      const billDate = new Date(bill.createdAt).toISOString().split('T')[0];
      const type = bill.billType;

      bill.billItems.forEach(bi => {
        const name = bi.itemName || bi.item?.itemName || 'Unknown';
        const category = bi.category || bi.item?.category || 'Unknown';
        const key = `${billDate}|${type}|${name}|${category}`;

        if (!map[key]) {
          map[key] = { date: billDate, type, name, category, qty: 0, revenue: 0 };
        }

        map[key].qty += bi.quantity;
        map[key].revenue += bi.quantity * bi.priceAtSale;
      });
    });

    return Object.values(map);
  }, [bills]);

  const filtered = salesAggregated.filter(e =>
    (!filterDate || e.date === filterDate) &&
    (filterType === 'All' || e.type === filterType)
  );

  const pageCount = Math.ceil(filtered.length / perPage);
  const pageEntries = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalSales = filtered.reduce((sum, item) => sum + item.revenue, 0).toFixed(2);
  const bevSales = filtered
    .filter(item => item.category === 'Beverage')
    .reduce((sum, item) => sum + item.revenue, 0)
    .toFixed(2);
  const foodSales = filtered
    .filter(item => item.category !== 'Beverage')
    .reduce((sum, item) => sum + item.revenue, 0)
    .toFixed(2);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Sales Report", 14, 20);
    if (filterDate) {
      doc.setFontSize(12);
      doc.text(`Filtered: ${filterType} on ${filterDate}`, 14, 30);
    }
    const head = ["Date", "Type", "Item", "Qty", "Revenue"];
    const body = filtered.map(e => [e.date, e.type, e.name, e.qty, e.revenue.toFixed(2)]);
    autoTable(doc, { head: [head], body, startY: filterDate ? 40 : 30 });
    doc.save(`sales_report_${filterType}_${filterDate || 'all'}.pdf`);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Sales Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Sales" value={`Rs. ${totalSales}`} icon={ShoppingCartIcon} color="blue" />
        <StatCard title="Food Revenue" value={`Rs. ${foodSales}`} icon={CurrencyDollarIcon} color="green" />
        <StatCard title="Beverages" value={`Rs. ${bevSales}`} icon={UserGroupIcon} color="yellow" />
      </div>

      <div className="bg-white p-4 rounded-md shadow">
        <div className="flex flex-wrap items-center justify-between mb-4 space-y-2">
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={filterDate}
              onChange={e => { setFilterDate(e.target.value); setCurrentPage(1); }}
              className="border rounded px-3 py-2 text-sm"
            />
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="border rounded px-3 py-2 text-sm"
            >
              {["All", "Restaurant", "Delivery"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Download Report</button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Type</th>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-right">Qty Sold</th>
                <th className="px-4 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pageEntries.length ? (
                pageEntries.map((e, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{e.date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        e.type === 'Restaurant' ? 'bg-green-100 text-green-700' :
                        e.type === 'Delivery' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'}`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{e.name}</td>
                    <td className="px-4 py-3 text-right">{e.qty}</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">Rs. {e.revenue.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">No sales found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-2 mt-4 text-sm">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50">
            Prev
          </button>
          <span className="py-1">Page {currentPage} / {pageCount}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
            className="px-3 py-1 border rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesBarChart salesData={filtered} />
        <TopProductPieChart salesData={filtered} />
      </div>
    </div>
  );
};

export default Dashboard;
