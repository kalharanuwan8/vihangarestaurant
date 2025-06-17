import React from "react";
import { useNavigate } from "react-router-dom";

const HeldOrders = ({ heldBills, onSelectHold }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 ml-20 sm:ml-24 md:ml-28 min-h-screen bg-gray-50">
      {/* Top Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">🕒 Held Orders</h2>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200 text-sm"
        >
          <span className="text-lg">⬅</span> Back to Billing
        </button>
      </div>

      {/* Held Orders */}
      {heldBills.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No held orders available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {heldBills.map((bill) => {
            const total = bill.items.reduce(
              (sum, item) => sum + item.price * item.qty,
              0
            );

            return (
              <div
                key={bill.id}
                className="bg-white border border-blue-200 hover:border-blue-400 shadow-md hover:shadow-xl rounded-lg p-5 transition-all duration-200 cursor-pointer"
                onClick={() => onSelectHold(bill.id)}
              >
                <div className="mb-2">
                  <p className="text-sm text-gray-700">
                    🕔 Held at:{" "}
                    <span className="font-semibold text-blue-700">
                      {bill.time}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {bill.items.length} items in this order
                  </p>
                </div>

                <div className="divide-y divide-dashed mt-3">
                  {bill.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between py-1 text-sm text-gray-700"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.qty} × Rs. {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-semibold">
                        Rs. {(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t pt-2 text-right text-sm font-bold text-blue-800">
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

export default HeldOrders;
