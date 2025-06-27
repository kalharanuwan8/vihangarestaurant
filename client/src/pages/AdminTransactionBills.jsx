import React, { useEffect, useState, useMemo } from "react";
import axios from "../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../components/Sidebar";
import HorizontalNavbar from "../components/HorizontalNavbar";

const AdminTransactionBills = () => {
  const [bills, setBills] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const perPage = 10;

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    axios
      .get("/transbills")
      .then((res) => setBills(res.data))
      .catch(console.error);
  }, []);

  const filteredItems = useMemo(() => {
    const itemMap = {};

    bills.forEach((bill) => {
      const dateStr = new Date(bill.createdAt).toISOString().split("T")[0];
      if (!filterDate || dateStr === filterDate) {
        bill.billItems.forEach((item) => {
          const key = item.itemName;
          if (!itemMap[key]) {
            itemMap[key] = {
              itemName: item.itemName,
              totalQty: 0,
              totalRevenue: 0,
              price: item.priceAtSale,
            };
          }
          itemMap[key].totalQty += item.quantity;
          itemMap[key].totalRevenue += item.quantity * item.priceAtSale;
        });
      }
    });

    return Object.values(itemMap);
  }, [bills, filterDate]);

  const pageCount = Math.ceil(filteredItems.length / perPage);
  const pageEntries = filteredItems.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Grouped Transaction Report", 14, 20);

    if (filterDate) {
      doc.setFontSize(12);
      doc.text(`Filtered Date: ${filterDate}`, 14, 30);
    }

    const head = [["Item Name", "Total Quantity", "Total Revenue"]];
    const body = filteredItems.map((item) => [
      item.itemName,
      item.totalQty,
      `Rs. ${item.totalRevenue.toFixed(2)}`,
    ]);

    autoTable(doc, {
      head,
      body,
      startY: filterDate ? 40 : 30,
    });

    doc.save(`grouped_transaction_${filterDate || "all"}.pdf`);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "ml-52" : "ml-20"
        }`}
      >
        <HorizontalNavbar />

        <main className="flex-1 overflow-x-auto overflow-y-auto p-8 space-y-8">
          <div className="flex justify-between items-center border-b border-gray-300 pb-3">
            <h1 className="text-3xl font-semibold text-gray-800">
              Grouped Transaction Summary
            </h1>
            <div className="flex gap-4 items-center">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Filter by date"
              />
              <button
                onClick={downloadPDF}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow-md transition"
                aria-label="Download PDF report"
              >
                {/* PDF icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Download PDF
              </button>
            </div>
          </div>

          <div className="rounded-lg shadow-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs font-semibold tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Item Name</th>
                  <th className="px-6 py-3 text-center">Total Quantity</th>
                  <th className="px-6 py-3 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {pageEntries.length > 0 ? (
                  pageEntries.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-100 hover:bg-indigo-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{item.itemName}</td>
                      <td className="px-6 py-4 text-center">{item.totalQty}</td>
                      <td className="px-6 py-4 text-right font-semibold text-indigo-600">
                        Rs. {item.totalRevenue.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-12 text-gray-400 italic select-none"
                    >
                      No transaction data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center space-x-3 text-sm text-gray-600">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Previous page"
            >
              Prev
            </button>
            <span className="select-none">
              Page <strong>{currentPage}</strong> of <strong>{pageCount}</strong>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
              className="px-4 py-2 border rounded-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTransactionBills;
