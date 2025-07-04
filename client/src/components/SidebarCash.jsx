import { useState } from "react";
import {
  FaCashRegister,
  FaReceipt,
  FaRegClock,
  FaSignOutAlt,
  FaExchangeAlt,
  FaRedoAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const SidebarCash = () => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleManualReset = async () => {
    setIsProcessing(true);
    try {
      await axios.post("/reset-items");
      alert("✅ Items reset and PDF saved to Downloads.");
    } catch (err) {
      console.error("Reset failed", err);
      alert("❌ Reset failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-16 sm:w-20 md:w-24 bg-blue-900 text-white h-screen flex flex-col items-center py-6 fixed left-0 top-0 shadow-md z-10">
        {/* Billing */}
        <div
          className="mb-12 cursor-pointer flex flex-col items-center hover:text-yellow-400"
          onClick={() => navigate("/cashier")}
        >
          <FaCashRegister className="text-4xl" />
          <p className="text-xs mt-1 hidden md:block">Billing</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-10 items-center flex-grow">
          <div
            className="flex flex-col items-center cursor-pointer hover:text-yellow-400"
            onClick={() => navigate("/cashier/hold")}
          >
            <FaRegClock className="text-2xl" />
            <span className="text-xs mt-1 hidden md:block">Hold</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer hover:text-yellow-400"
            onClick={() => navigate("/cashier/billed")}
          >
            <FaReceipt className="text-2xl" />
            <span className="text-xs mt-1 hidden md:block">Billed</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer hover:text-yellow-400"
            onClick={() => navigate("/transaction")}
          >
            <FaExchangeAlt className="text-2xl" />
            <span className="text-xs mt-1 hidden md:block">Transaction</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer hover:text-yellow-400"
            onClick={() => navigate("/transaction-bills")}
          >
            <FaReceipt className="text-2xl" />
            <span className="text-xs mt-1 hidden md:block">Trans. Bills</span>
          </div>

          {/* Manual Reset */}
          <div
            className="flex flex-col items-center cursor-pointer hover:text-yellow-400"
            onClick={() => setShowConfirmModal(true)}
          >
            <FaRedoAlt className="text-2xl" />
            <span className="text-xs mt-1 hidden md:block text-center">
              Reset Items
            </span>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-auto mb-4 cursor-pointer hover:text-red-400">
          <FaSignOutAlt className="text-2xl" />
          <p className="text-xs hidden md:block">Logout</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center transition duration-200">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl transform animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Confirm Reset
            </h2>
            <p className="mb-5 text-sm text-center text-gray-600">
              Are you sure you want to reset all non-Beverage/Cigarette items
              and download the item status PDF?
            </p>

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
                  isProcessing ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={handleManualReset}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Yes, Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarCash;
