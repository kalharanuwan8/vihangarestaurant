import { FaUserCircle, FaReceipt, FaRegClock, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SidebarCash = () => {
  const navigate = useNavigate();

  return (
    <div className="w-20 sm:w-24 md:w-28 bg-blue-900 text-white h-screen flex flex-col items-center py-6 fixed left-0 top-0 shadow-md">
      <div className="mb-12">
        <FaUserCircle className="text-4xl" />
        <p className="text-xs mt-1 hidden md:block">Profile</p>
      </div>

      <div className="flex flex-col gap-10 items-center flex-grow">
        {/* Navigate to Held Orders page */}
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
      </div>

      <div className="mt-auto mb-4 cursor-pointer hover:text-red-400">
        <FaSignOutAlt className="text-2xl" />
        <p className="text-xs hidden md:block">Logout</p>
      </div>
    </div>
  );
};

export default SidebarCash;