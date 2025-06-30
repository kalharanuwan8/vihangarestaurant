import React, { useEffect, useState, useMemo } from "react";
import axios from "../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../components/Sidebar";
import HorizontalNavbar from "../components/HorizontalNavbar";

const AdminTransactionBills = () => {
  const [bills, setBills] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);

  useEffect(() => {
    axios.get("/transbills")
      .then((res) => setBills(res.data))
      .catch(console.error);
  }, []);

  const groupedByDate = useMemo(() => {
    const dateMap = {};

    bills.forEach((bill) => {
      const date = new Date(bill.createdAt).toISOString().split("T")[0];
      if (filterDate && date !== filterDate) return;

      if (!dateMap[date]) dateMap[date] = {};

      bill.billItems.forEach((item) => {
        const key = item.itemName;
        if (!dateMap[date][key]) {
          dateMap[date][key] = {
            itemName: item.itemName,
            totalQty: 0,
            totalRevenue: 0,
          };
        }

        dateMap[date][key].totalQty += item.quantity;
        dateMap[date][key].totalRevenue += item.quantity * item.priceAtSale;
      });
    });

    return Object.entries(dateMap)
      .sort((a, b) => b[0].localeCompare(a[0])); // Newest date first
  }, [bills, filterDate]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Grouped Transaction Report", 14, 20);

    let startY = 30;

    if (filterDate) {
      doc.setFontSize(12);
      doc.text(`Filtered Date: ${filterDate}`, 14, startY);
      startY += 10;
    }

    groupedByDate.forEach(([date, items]) => {
      doc.setFontSize(14);
      doc.text(`Date: ${date}`, 14, startY);
      startY += 8;

      const itemRows = Object.values(items).map((item) => [
        item.itemName,
        `Rs. ${(item.totalRevenue / item.totalQty).toFixed(2)}`, // Unit Price
        item.totalQty,
        `Rs. ${item.totalRevenue.toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [["Item Name", "Unit Price", "Total Quantity", "Total Revenue"]],
        body: itemRows,
        startY,
        styles: { fontSize: 10 },
        theme: 'striped',
      });

      const dayTotal = Object.values(items).reduce((sum, item) => sum + item.totalRevenue, 0);
      startY = doc.lastAutoTable.finalY + 5;
      doc.setFontSize(11);
      doc.text(`Grand Total: Rs. ${dayTotal.toFixed(2)}`, 14, startY);
      startY += 10;
    });

    doc.save(`grouped_transaction_${filterDate || "all"}.pdf`);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "ml-52" : "ml-20"
        }`}
      >
        <HorizontalNavbar />

        <main className="flex-1 overflow-x-auto overflow-y-auto p-8 space-y-8">
          <div className="flex justify-between items-center border-b border-gray-300 pb-3">
            <h1 className="text-3xl font-semibold text-gray-800">
              Transaction Bills Summary
            </h1>
            <div className="flex gap-4 items-center">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={downloadPDF}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow-md transition"
              >
                ⬇ Download PDF
              </button>
            </div>
          </div>

          {groupedByDate.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No data available for selected date.</p>
          ) : (
            groupedByDate.map(([date, items]) => {
              const dayTotal = Object.values(items).reduce(
                (sum, item) => sum + item.totalRevenue,
                0
              );

              return (
                <div key={date} className="space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-700">📅 {date}</h2>

                  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full text-sm text-gray-700 bg-white">
                      <thead className="bg-indigo-100 text-indigo-700 text-xs uppercase font-semibold">
                        <tr>
                          <th className="px-6 py-3 text-left">Item Name</th>
                          <th className="px-6 py-3 text-center">Unit Price</th>
                          <th className="px-6 py-3 text-center">Total Qty</th>
                          <th className="px-6 py-3 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(items).map((item, index) => (
                          <tr
                            key={index}
                            className="border-t border-gray-100 hover:bg-indigo-50 transition"
                          >
                            <td className="px-6 py-4 font-medium">{item.itemName}</td>
                            <td className="px-6 py-4 text-center">
                              Rs. {(item.totalRevenue / item.totalQty).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-center">{item.totalQty}</td>
                            <td className="px-6 py-4 text-right text-indigo-600 font-semibold">
                              Rs. {item.totalRevenue.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold text-indigo-800 border-t">
                          <td className="px-6 py-3 text-left">Grand Total</td>
                          <td></td>
                          <td></td>
                          <td className="px-6 py-3 text-right">
                            Rs. {dayTotal.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminTransactionBills;
