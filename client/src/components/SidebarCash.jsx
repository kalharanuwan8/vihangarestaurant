import { 
  FaCashRegister, 
  FaReceipt, 
  FaRegClock, 
  FaSignOutAlt, 
  FaExchangeAlt 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SidebarCash = () => {
  const navigate = useNavigate();

  return (
    <div className="w-16 sm:w-20 md:w-24 bg-blue-900 text-white h-screen flex flex-col items-center py-6 fixed left-0 top-0 shadow-md">
      
      {/* Billing (Previously Profile) */}
      <div
        className="mb-12 cursor-pointer flex flex-col items-center hover:text-yellow-400"
        onClick={() => navigate("/cashier")}
      >
        <FaCashRegister className="text-4xl" />
        <p className="text-xs mt-1 hidden md:block">Billing</p>
      </div>

      <div className="flex flex-col gap-10 items-center flex-grow">
        {/* Held Orders */}
        <div
          className="flex flex-col items-center cursor-pointer hover:text-yellow-400"
          onClick={() => navigate("/cashier/hold")}
        >
          <FaRegClock className="text-2xl" />
          <span className="text-xs mt-1 hidden md:block">Hold</span>
        </div>

        {/* Billed Orders */}
        <div
          className="flex flex-col items-center cursor-pointer hover:text-yellow-400"
          onClick={() => navigate("/cashier/billed")}
        >
          <FaReceipt className="text-2xl" />
          <span className="text-xs mt-1 hidden md:block">Billed</span>
        </div>

        {/* Transactions */}
        <div
          className="flex flex-col items-center cursor-pointer hover:text-yellow-400"
          onClick={() => navigate("/transaction")}
        >
          <FaExchangeAlt className="text-2xl" />
          <span className="text-xs mt-1 hidden md:block">Transaction</span>
        </div>

        {/* Transaction Bills */}
        <div
          className="flex flex-col items-center cursor-pointer hover:text-yellow-400"
          onClick={() => navigate("/transaction-bills")}
        >
          <FaReceipt className="text-2xl" />
          <span className="text-xs mt-1 hidden md:block">Trans. Bills</span>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-auto mb-4 cursor-pointer hover:text-red-400">
        <FaSignOutAlt className="text-2xl" />
        <p className="text-xs hidden md:block">Logout</p>
      </div>
    </div>
  );
};

export default SidebarCash;
