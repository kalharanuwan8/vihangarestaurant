import React, { useEffect, useState } from "react";

const PrintBillModal = ({ items, total, billType, onClose, onSave }) => {
  const [shouldPrint, setShouldPrint] = useState(false);
  const now = new Date();

  useEffect(() => {
    if (shouldPrint) {
      const printTimeout = setTimeout(() => {
        window.print();
      }, 300); // Allow DOM to fully render before printing

      const handleAfterPrint = () => {
        setShouldPrint(false);
        onClose(); // ✅ Close modal only after print completes
      };

      window.addEventListener("afterprint", handleAfterPrint);

      return () => {
        clearTimeout(printTimeout);
        window.removeEventListener("afterprint", handleAfterPrint);
      };
    }
  }, [shouldPrint, onClose]);

  const handlePrintAndSave = async () => {
    try {
      await onSave();        // ✅ First save the bill
      setShouldPrint(true);  // ✅ Then trigger printing
    } catch (err) {
      console.error("Failed to save bill before print:", err);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-2xl w-full max-w-sm text-xs font-mono transition-all duration-200 printable">
        {/* Header */}
        <div className="text-center border-b pb-2 mb-3">
          <h1 className="text-lg font-bold tracking-wider text-gray-800">🍽 Vihanga Restaurant</h1>
          <p className="text-gray-600">No. 123, High Level Road, Meegoda</p>
          <p className="text-gray-600">📞 011-1234567</p>
          <p className="text-gray-500">{now.toLocaleString()}</p>
          <p className="text-sm font-bold text-indigo-700 mt-1">
            {billType === "Delivery" ? "🛵 Delivery Bill" : "🍽 Restaurant Bill"}
          </p>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.cartId} className="flex justify-between border-b border-dashed pb-1">
              <div>
                <p className="text-gray-800">{item.name || item.itemName}</p>
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
          <p>Thank you for your order! 🙏</p>
          <p>Please visit again. ❤</p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2 text-sm no-print">
          <button
            onClick={handlePrintAndSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
          >
            🖨 Print & Save
          </button>
          <button
            onClick={onSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
          >
            💾 Save Only
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded"
          >
            ↩️ Back to Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintBillModal;
