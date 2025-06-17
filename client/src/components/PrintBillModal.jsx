import React from "react";

const PrintBillModal = ({ items, total, onClose }) => {
  const now = new Date();

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-2xl w-full max-w-sm text-xs font-mono transition-all duration-200">
        
        {/* Header */}
        <div className="text-center border-b pb-2 mb-3">
          <h1 className="text-lg font-bold tracking-wider text-gray-800">
            🍽 Vihanga Restaurant
          </h1>
          <p className="text-gray-600">No. 123, High Level Road, Meegoda</p>
          <p className="text-gray-600">📞 011-1234567</p>
          <p className="text-gray-500">{now.toLocaleString()}</p>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-dashed pb-1"
            >
              <div>
                <p className="text-gray-800">{item.name}</p>
                <small className="text-gray-500">
                  Qty: {item.qty} × Rs. {item.price}
                </small>
              </div>
              <div className="text-right">
                <p className="text-gray-700 font-semibold">
                  Rs. {(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-2 text-right font-bold text-sm text-gray-800">
          Total: Rs. {total.toFixed(2)}
        </div>

        {/* Footer */}
        <div className="mt-5 text-center text-[11px] text-gray-600 border-t pt-3">
          <p>Thank you for dining with us! 🙏</p>
          <p>Please visit again. ❤</p>
        </div>

        {/* Close Button */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm shadow-md"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintBillModal;