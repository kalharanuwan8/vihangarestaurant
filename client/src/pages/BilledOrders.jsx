import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SidebarCash from "../components/SidebarCash";
import axios from "../api/axios";

const BilledOrders = () => {
  const navigate = useNavigate();
  const [billedBills, setBilledBills] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("All");

  // ✅ Fetch billed bills from backend
  useEffect(() => {
    axios
      .get("/bills")
      .then((res) => {
        const formatted = res.data.map((bill) => {
          const items = bill.billItems.map((bi) => ({
            name: bi.itemName || bi.item?.itemName || "Unknown Item",
            qty: bi.quantity,
            price: bi.priceAtSale,
          }));
          return {
            billCode: bill.billCode,
            billType: bill.billType,
            createdAt: bill.createdAt,
            items,
          };
        });
        setBilledBills(formatted);
      })
      .catch((err) => {
        console.error("Failed to load billed bills:", err);
      });
  }, []);

  // Format date as yyyy-mm-dd
  const formatDate = (isoDate) =>
    new Date(isoDate).toISOString().split("T")[0];

  // ✅ Group and filter bills
  const groupedBills = useMemo(() => {
    const result = {};

    billedBills.forEach((bill) => {
      const billDate = formatDate(bill.createdAt);

      if (
        (!filterDate || billDate === filterDate) &&
        (filterType === "All" || bill.billType === filterType)
      ) {
        if (!result[billDate]) result[billDate] = [];
        result[billDate].push(bill);
      }
    });

    return Object.entries(result).sort((a, b) => b[0].localeCompare(a[0]));
  }, [billedBills, filterDate, filterType]);

  // ✅ Reprint handler
  const handleReprint = (bill) => {
    localStorage.setItem("billToPrint", JSON.stringify(bill));
    window.open("/reprint", "_blank", "width=400,height=600");
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <SidebarCash isExpanded={true} />

      <div className="flex-1 ml-24 p-6 bg-gray-50 min-h-screen overflow-auto">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-blue-900">🧾 Billed Orders</h2>
          <div className="flex gap-3 items-center">
            <input
              type="date"
              className="px-3 py-2 border rounded text-sm"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <select
              className="px-3 py-2 border rounded text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option>All</option>
              <option>Restaurant</option>
              <option>Delivery</option>
            </select>
            <button
              onClick={() => navigate("/cashier")}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow"
            >
              ← Back to Billing
            </button>
          </div>
        </div>

        {groupedBills.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No billed orders found.</p>
        ) : (
          groupedBills.map(([date, bills]) => (
            <div key={date} className="mb-10">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                📅 {date}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bills.map((bill, index) => {
                  const total = bill.items.reduce(
                    (sum, item) => sum + item.price * item.qty,
                    0
                  );

                  return (
                    <div
                      key={bill.billCode || index}
                      className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition-all duration-200 p-4"
                    >
                      <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                          Bill #{bill.billCode || index + 1}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {bill.billType}
                        </span>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {bill.items.map((item, i) => (
                          <li key={i} className="flex justify-between">
                            <span>
                              {item.name} × {item.qty}
                            </span>
                            <span>Rs. {(item.price * item.qty).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t pt-2 mt-3 text-right text-sm font-bold text-blue-800">
                        Total: Rs. {total.toFixed(2)}
                      </div>

                      {/* 🖨 Reprint Button */}
                      <button
                        onClick={() => handleReprint({ ...bill, total })}
                        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                      >
                        🖨 Reprint Bill
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BilledOrders;