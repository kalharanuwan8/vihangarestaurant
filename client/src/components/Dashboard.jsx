  import React, { useState, useMemo } from 'react';
  import {
    ShoppingCartIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
  } from '@heroicons/react/24/outline';
  import jsPDF from 'jspdf';
  import autoTable from 'jspdf-autotable';
  import SalesBarChart from '../components/charts/SalesBarChart';
  import TopProductPieChart from '../components/charts/TopProductsPieChart';
  import { useNavigate } from 'react-router-dom';

  const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorVariants = {
      blue: { border: 'border-blue-500', bg: 'hover:bg-blue-500' },
      green: { border: 'border-green-500', bg: 'hover:bg-green-500' },
      yellow: { border: 'border-yellow-500', bg: 'hover:bg-yellow-500' },
      purple: { border: 'border-purple-500', bg: 'hover:bg-purple-500' },
    };
    const selectedColor = colorVariants[color] || colorVariants.blue

    return (
      <div className={`group bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 transition-all duration-300 ease-in-out ${selectedColor.border} ${selectedColor.bg}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase group-hover:text-white">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 group-hover:text-white">{value}</p>
          </div>
          <div className="p-2 sm:p-3 bg-gray-100 rounded-full group-hover:bg-white/20">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 group-hover:text-white" />
          </div>
        </div>
      </div>
    );
  };

  // 🔄 Dummy Sales
  const dummySales = Array.from({ length: 30 }).map((_, index) => {
    const categories = ['Beverage', 'Food', 'Bakery'];
    const names = ['Espresso', 'Latte', 'Pasta', 'Cake', 'Roll', 'Sandwich'];
    const randomCategory = categories[index % categories.length];
    const randomName = names[index % names.length] + ` ${index + 1}`;
    const price = Math.floor(100 + Math.random() * 400);
    const date = new Date(Date.now() - (index * 86400000)).toISOString().split('T')[0]; // recent dates
    return { id: index + 1, name: randomName, category: randomCategory, price, date };
  });

  const Dashboard = () => {
    const [filter, setFilter] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const categories = ['All', ...new Set(dummySales.map(item => item.category))];

    const filteredSales = useMemo(() => {
      let result = [...dummySales];

      if (filter) {
        result = result.filter(sale => sale.date === filter);
      }

      if (selectedCategory !== 'All') {
        result = result.filter(sale => sale.category === selectedCategory);
      }

      return result;
    }, [filter, selectedCategory]);

    const totalPages = Math.ceil(filteredSales.length / recordsPerPage);
    const paginatedSales = filteredSales.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    const downloadPDF = () => {
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Sales Report", 14, 20);

      if (filter) {
        doc.setFontSize(12);
        doc.text(`Filtered by Date: ${filter}`, 14, 30);
      }

      const tableColumn = ["Item Name", "Price (Rs)", "Date"];
      const tableRows = filteredSales.map(item => [
        item.name,
        item.price.toFixed(2),
        item.date,
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: filter ? 40 : 30,
      });

      doc.save(`sales_report_${filter || 'all'}.pdf`);
    };



    return (
      <div className="space-y-6 px-4 py-6 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome back</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard title="Total Sales" value="Rs.12,450" icon={ShoppingCartIcon} color="blue" />
          <StatCard title="Food Items" value="Rs.8,990" icon={CurrencyDollarIcon} color="green" />
          <StatCard title="Beverages" value="Rs.1,245" icon={UserGroupIcon} color="yellow" />
        </div>

        {/* Sales Summary */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Sales Summary</h2>
              <input
                type="date"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={downloadPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Download Report
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1 rounded-full text-sm ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sales Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[400px] border border-gray-300 rounded-lg bg-white shadow">
              <div className="grid grid-cols-3 bg-blue-100 text-blue-800 font-semibold text-center">
                <div className="border border-gray-300 py-3">Item Name</div>
                <div className="border border-gray-300 py-3">Price</div>
                <div className="border border-gray-300 py-3">Date</div>
              </div>

              {paginatedSales.length > 0 ? (
                paginatedSales.map((item) => (
                  <div key={item.id} className="grid grid-cols-3 text-center">
                    <div className="border border-gray-300 px-4 py-3 font-medium text-gray-800">{item.name}</div>
                    <div className="border border-gray-300 px-4 py-3 text-indigo-600 font-semibold font-mono">
                      Rs. {item.price.toFixed(2)}
                    </div>
                    <div className="border border-gray-300 px-4 py-3 text-gray-600">{item.date}</div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 border border-t-0 border-gray-300">
                  No sales for the selected filters.
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <SalesBarChart salesData={dummySales} />
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <TopProductPieChart salesData={dummySales} />
          </div>
        </div>
      </div>
    );
  };

  export default Dashboard;
