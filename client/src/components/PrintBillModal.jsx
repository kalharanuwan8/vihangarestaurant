import React from "react";

const PrintBillModal = ({ items, total, billType, onClose, onSave }) => {
  const now = new Date();
const handlePrintAndSave = async () => {
  try {
    const saved = await onSave();
    if (!saved) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
      <head>
        <style>
          body { font-family: monospace; padding: 20px; font-size: 12px; width: 80mm; }
          h2, p { text-align: center; margin: 0; }
          .line { border-top: 1px dashed #000; margin: 8px 0; }
        </style>
      </head>
      <body>
        <h2>🍽 Vihanga Restaurant</h2>
        <p>High Level Road, Meegoda</p>
        <p>📞 011-1234567</p>
        <p>${new Date().toLocaleString()}</p>
        <div class="line"></div>
        ${items.map((item) => `
          <div style="display:flex; justify-content:space-between;">
            <span>${item.name}</span>
            <span>${item.qty} x ${item.price}</span>
          </div>
        `).join("")}
        <div class="line"></div>
        <div style="text-align:right; font-weight:bold;">Total: Rs. ${total.toFixed(2)}</div>
        <p style="margin-top:10px; text-align:center;">🙏 Thank you! Please visit again.</p>
      </body>
      </html>
    `);
    doc.close();

    // Wait a little and print
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe); // Clean up
      }, 300);
    };

    onClose(); // Close modal
  } catch (err) {
    console.error("❌ Print & Save failed:", err);
  }
};




  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-2xl w-full max-w-sm text-xs font-mono transition-all duration-200">
        {/* Header */}
        <div className="text-center border-b pb-2 mb-3">
          <h1 className="text-lg font-bold text-gray-800">🍽 Vihanga Restaurant</h1>
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
        <div className="mt-4 flex flex-col gap-2 text-sm">
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
