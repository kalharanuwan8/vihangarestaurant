import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import SidebarCash from "../components/SidebarCash";

const TransactionBills = () => {
  const [txBills, setTxBills] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/transbills")
      .then(res => setTxBills(res.data))
      .catch(console.error);
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    txBills.forEach(b => {
      const d = new Date(b.createdAt).toISOString().split("T")[0];
      if (filterDate && d !== filterDate) return;
      if (!map[d]) map[d] = [];
      map[d].push(b);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [txBills, filterDate]);

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <SidebarCash isExpanded />
      
      <div className="flex-grow ml-24 px-6 py-6">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-3">
            <label htmlFor="date" className="text-sm font-medium text-gray-700">
              Filter by Date:
            </label>
            <input
              id="date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/cashier")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition-all duration-200 text-sm"
          >
            <span className="text-lg">⬅</span> Back to Billing
          </button>
        </div>

        {/* Bills Grouped by Date */}
        {grouped.length === 0 ? (
          <p className="text-gray-500 text-center mt-16 text-lg">No transaction bills found.</p>
        ) : grouped.map(([date, bills]) => (
          <div key={date} className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-1">
              Date: {date}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bills.map((b) => {
                const total = b.billItems.reduce((sum, item) => sum + item.priceAtSale * item.quantity, 0);
                return (
                  <div
                    key={b._id}
                    className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-blue-600"># {b.billCode}</span>
                      <span className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleTimeString()}</span>
                    </div>

                    <ul className="space-y-1 text-sm text-gray-700">
                      {b.billItems.map((i, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{i.itemName} × {i.quantity}</span>
                          <span>Rs. {(i.priceAtSale * i.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 text-right text-sm font-semibold text-green-700">
                      Total: Rs. {total.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionBills;
