import React, { useEffect, useState } from "react";

const PrintWindow = () => {
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("billToPrint"));
    if (data) {
      setBill(data);
      setTimeout(() => {
        window.print();
        localStorage.removeItem("billToPrint"); // Clean after print
      }, 300);
    }
  }, []);

  if (!bill) return <p>Loading Bill...</p>;

  return (
    <div className="text-xs font-mono p-4 w-[80mm]">
      <h2 className="text-center font-bold">🍽 Vihanga Restaurant</h2>
      <p className="text-center text-gray-600">High Level Road, Meegoda</p>
      <p className="text-center text-gray-600">📞 011-1234567</p>
      <p className="text-center">{new Date().toLocaleString()}</p>
      <hr className="my-2 border-dashed" />
      {bill.items.map((item, idx) => (
        <div key={idx} className="flex justify-between">
          <span>{item.name}</span>
          <span>{item.qty} x {item.price}</span>
        </div>
      ))}
      <hr className="my-2 border-dashed" />
      <div className="text-right font-bold">Total: Rs. {bill.total.toFixed(2)}</div>
      <p className="mt-2 text-center">🙏 Thank you! Please visit again.</p>
    </div>
  );
};


export default PrintWindow;
