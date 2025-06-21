import { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const BillingCart = ({ items, onQtyChange, onRemove, onPrint, onHold }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [amountGiven, setAmountGiven] = useState("");
  const change = parseFloat(amountGiven) - total;

  return (
    <div className="w-full md:w-[300px] lg:w-[350px] bg-gray-100 h-screen p-4 shadow-inner overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Current Bill</h2>

      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-gray-500">No items added yet.</p>
        ) : (
          items.map((item) => {
            const qtyValue = item.qty === 0 ? "" : item.qty;

            return (
              <div
                key={item.id}
                className="bg-white p-3 rounded shadow-sm flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">{item.name}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onRemove(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onQtyChange(item.id, -1)}
                      className="bg-gray-200 rounded p-1 hover:bg-gray-300"
                    >
                      <FaMinus size={12} />
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={qtyValue}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          onQtyChange(item.id, 0, true); // set qty to 0, show empty
                        } else {
                          const parsed = parseInt(value);
                          if (!isNaN(parsed) && parsed >= 0) {
                            onQtyChange(item.id, parsed, true);
                          }
                        }
                      }}
                      className="w-12 text-center border rounded px-1 py-[2px] focus:outline-none"
                    />

                    <button
                      onClick={() => onQtyChange(item.id, 1)}
                      className="bg-gray-200 rounded p-1 hover:bg-gray-300"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <span className="font-medium">Rs. {item.price * item.qty}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t mt-4 pt-4">
        <p className="font-semibold text-lg">Total: Rs. {total}</p>
        <button
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded mt-4"
          onClick={onHold}
          disabled={items.length === 0}
        >
          Hold Bill
        </button>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2"
          onClick={onPrint}
          disabled={items.length === 0}
        >
          Print Bill
        </button>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow text-sm">
        <h3 className="font-semibold mb-2 text-gray-800">💰 Customer Payment</h3>
        <input
          type="number"
          value={amountGiven}
          onChange={(e) => setAmountGiven(e.target.value)}
          placeholder="Enter amount received"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-gray-700">
          Change:{" "}
          <span
            className={`font-semibold ${
              change < 0 ? "text-red-600" : "text-green-700"
            }`}
          >
            Rs. {isNaN(change) ? "0.00" : change.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillingCart;
