import React, { useState } from 'react';
import {
  ArrowLeftOnRectangleIcon,
  ChartPieIcon,
  QueueListIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  UserPlusIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ArrowPathIcon, // 🔁 Icon for Reset Items
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const MenuItem = React.memo(({ icon: Icon, label, isExpanded, onClick }) => (
  <div
    onClick={onClick}
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
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleManualReset = async () => {
    setIsProcessing(true);
    try {
      await axios.post('/reset-items');
      alert('✅ Items reset and PDF saved to Downloads.');
    } catch (err) {
      console.error('Reset failed', err);
      alert('❌ Reset failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div
        className={`bg-indigo-500 text-white h-screen fixed top-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-lg ${
          isExpanded ? 'w-52' : 'w-16 sm:w-20'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 pb-2 flex items-center ${
            isExpanded ? 'justify-between' : 'justify-center'
          }`}
        >
          {isExpanded && (
            <div className="flex items-center space-x-2 transition-opacity duration-300">
              {/* Logo/Brand (optional) */}
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronDoubleLeftIcon className="h-6 w-6" />
            ) : (
              <ChevronDoubleRightIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col px-3 overflow-hidden">
          <nav className="flex-1 space-y-2">
            <MenuItem
              icon={ChartPieIcon}
              label="Dashboard"
              isExpanded={isExpanded}
              onClick={() => navigate('/admin')}
            />
            <MenuItem
              icon={UserPlusIcon}
              label="Add Members"
              isExpanded={isExpanded}
              onClick={() => navigate('/addmembers')}
            />
            <MenuItem
              icon={QueueListIcon}
              label="Items"
              isExpanded={isExpanded}
              onClick={() => navigate('/itemsmenu')}
            />
            <MenuItem
              icon={BanknotesIcon}
              label="Transaction Bills"
              isExpanded={isExpanded}
              onClick={() => navigate('/transbills')}
            />
            <MenuItem
              icon={DocumentTextIcon}
              label="Logs"
              isExpanded={isExpanded}
              onClick={() => navigate('/logs')}
            />
            <MenuItem
              icon={Cog6ToothIcon}
              label="Settings"
              isExpanded={isExpanded}
              onClick={() => navigate('/settings')}
            />

            {/* 🆕 Manual Reset */}
            <MenuItem
              icon={ArrowPathIcon}
              label="Reset Items"
              isExpanded={isExpanded}
              onClick={() => setShowModal(true)}
            />
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            <MenuItem
              icon={ArrowLeftOnRectangleIcon}
              label="Logout"
              isExpanded={isExpanded}
            />
          </div>
        </div>
      </div>

      {/* 🟦 Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Confirm Reset
            </h2>
            <p className="mb-5 text-sm text-center text-gray-600">
              Are you sure you want to reset all non-Beverage/Cigarette item
              quantities and download the item status PDF?
            </p>

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setShowModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
                  isProcessing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                onClick={handleManualReset}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Yes, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
