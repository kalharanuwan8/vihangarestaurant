import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarCash from "../components/SidebarCash";
import axios from "../api/axios";

const BilledOrders = () => {
  const navigate = useNavigate();
  const [billedBills, setBilledBills] = useState([]);

  useEffect(() => {
    axios
      .get("/bills")
      .then((res) => {
        const formatted = res.data.map((bill) => {
          const items = bill.billItems.map((bi) => ({
            name: bi.item?.itemName || "Unknown Item",
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

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SidebarCash isExpanded={true} />

      {/* Main content */}
      <div className="flex-1 ml-24 p-6 bg-gray-50 min-h-screen overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-900">🧾 Billed Orders</h2>
          <button
            onClick={() => navigate("/cashier")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow"
          >
            ← Back to Billing
          </button>
        </div>

        {billedBills.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No billed orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {billedBills.map((bill, index) => {
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
                    <h3 className="text-sm font-semibold text-gray-800">
                      Bill #{bill.billCode || index + 1}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {bill.billType}
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {bill.items.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{item.name} × {item.qty}</span>
                        <span>Rs. {(item.price * item.qty).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-2 mt-3 text-right text-sm font-bold text-blue-800">
                    Total: Rs. {total.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BilledOrders;
