import React from "react";
import { useNavigate } from "react-router-dom";

const BilledOrders = ({ billedBills }) => {
  const navigate = useNavigate();

  return (
    <div className="ml-20 sm:ml-24 md:ml-28 p-6 w-full min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">🧾 Billed Orders</h2>
        <button
          onClick={() => navigate("/")}
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
                key={bill.id}
                className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition-all duration-200 p-4"
              >
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Bill #{index + 1}
                  </h3>
                  <span className="text-xs text-gray-500">{bill.time}</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {bill.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BilledOrders;
