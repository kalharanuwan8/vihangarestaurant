import React from 'react';
import { 
  UserCircleIcon, ReceiptRefundIcon, ClockIcon, ArrowLeftOnRectangleIcon, 
  ChartPieIcon, QueueListIcon, CalculatorIcon, Cog6ToothIcon, 
  ChevronDoubleLeftIcon, ChevronDoubleRightIcon, UserPlusIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const MenuItem = React.memo(({ icon: Icon, label, isExpanded, onClick }) => (
  <div 
    onClick={onClick}          // Attach onClick here
    className="flex items-center cursor-pointer w-full p-3 hover:bg-indigo-600 rounded-lg transition-colors duration-200"
  >
    <Icon className="h-6 w-6 flex-shrink-0" />
    <span 
      className={`ml-4 text-sm font-medium transition-all duration-200 whitespace-nowrap overflow-hidden ${
        isExpanded ? 'opacity-100 w-full' : 'opacity-0 w-0'
      }`}
    >
      {label}
    </span>
  </div>
));

const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const navigate = useNavigate();  // Move inside component

  const handleitemsclick = (e) => {
    e.preventDefault();  // optional here if it's a div, but can keep for safety
    navigate('/itemsmenu');
  };

  return (
    <div
      className={`bg-indigo-500 text-white h-screen fixed top-0 left-0 z-50 flex flex-col
      transition-all duration-300 ease-in-out shadow-lg ${isExpanded ? 'w-52' : 'w-20'}`}
    >
      {/* Header section */}
      <div className={`p-4 pb-2 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        {isExpanded && (
          <div className="flex items-center space-x-2 transition-opacity duration-300">
            {/* Brand or something */}
          </div>
        )}
        <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-indigo-600 transition-colors">
          {isExpanded ? <ChevronDoubleLeftIcon className="h-6 w-6" /> : <ChevronDoubleRightIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col px-3 overflow-hidden">
        <nav className="flex-1 space-y-2">
          <MenuItem icon={ChartPieIcon} label="Dashboard" isExpanded={isExpanded} />
          <MenuItem icon={ClockIcon} label="Hold" isExpanded={isExpanded} />
          <MenuItem icon={ReceiptRefundIcon} label="Billed" isExpanded={isExpanded} />
          <MenuItem icon={UserPlusIcon} label="Add Members" isExpanded={isExpanded}/>          {/* Pass onClick handler here */}
          <MenuItem icon={QueueListIcon} label="Items" isExpanded={isExpanded} onClick={handleitemsclick} />
          <MenuItem icon={CalculatorIcon} label="Calculator" isExpanded={isExpanded} />
          <MenuItem icon={Cog6ToothIcon} label="Settings" isExpanded={isExpanded} />
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <MenuItem icon={ArrowLeftOnRectangleIcon} label="Logout" isExpanded={isExpanded} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
