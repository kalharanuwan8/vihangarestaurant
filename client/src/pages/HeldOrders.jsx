import React from "react";
import { useNavigate } from "react-router-dom";
import SidebarCash from "../components/SidebarCash"; // Adjust path if needed

const HeldOrders = ({ heldBills = [], onSelectHold }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      {/* SidebarCash fixed width, always expanded */}
      <SidebarCash isExpanded={true} />

      {/* Main content area with left margin same as Sidebar */}
      <div className="flex-1 ml-24 p-6 bg-gray-50 min-h-screen overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-blue-900">🕒 Held Orders</h2>
          <button
            onClick={() => navigate("/cashier")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-all duration-200 text-sm"
          >
            <span className="text-lg">⬅</span> Back to Billing
          </button>
        </div>

        {/* Held Orders List */}
        {heldBills.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No held orders available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {heldBills.map((bill) => {
              const total = bill.items.reduce(
                (sum, item) => sum + item.price * item.qty,
                0
              );

              return (
                <div
                  key={bill.id}
                  className="bg-white border border-blue-200 hover:border-blue-400 shadow-md hover:shadow-lg rounded-xl p-4 transition-all duration-200 cursor-pointer"
                  onClick={() => onSelectHold(bill.id)}
                >
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      🕔 Held at:{" "}
                      <span className="font-semibold text-blue-700">{bill.time}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {bill.items.length} items in this order
                    </p>
                  </div>

                  <div className="divide-y divide-dashed">
                    {bill.items.map((item) => (
                      <div
                        key={`${bill.id}-${item.id}`}
                        className="flex justify-between py-1 text-sm text-gray-700"
                      >
                        <div className="w-3/5 truncate">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.qty} × Rs. {item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right font-semibold w-2/5">
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
    </div>
  );
};

export default HeldOrders;
