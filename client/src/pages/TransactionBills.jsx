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
      <div className="flex-grow ml-24 p-4">
        {/* Top Bar with Filter on left, Back button on right */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="date" className="text-sm font-medium text-gray-700">
              Filter by Date:
            </label>
            <input
              id="date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border px-3 py-1 rounded"
            />
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/cashier")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-all duration-200 text-sm"
          >
            <span className="text-lg">⬅</span> Back to Billing
          </button>
        </div>

        {/* Bills Display */}
        {grouped.length === 0 ? (
          <p className="text-gray-500">No transaction bills found.</p>
        ) : grouped.map(([date, bills]) => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-semibold mb-3">📅 {date}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bills.map((b) => {
                const total = b.billItems.reduce((s, i) => s + i.priceAtSale * i.quantity, 0);
                return (
                  <div key={b._id} className="bg-white p-4 rounded shadow">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">{b.billCode}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(b.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {b.billItems.map((i, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{i.itemName} × {i.quantity}</span>
                          <span>Rs. {(i.priceAtSale * i.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-right font-semibold">
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
