import React, { useState, useRef, useEffect } from 'react';
import {
  SquaresPlusIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  CalculatorIcon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Calculator from './Calculator';

const HorizontalNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white shadow-sm flex items-center justify-between py-2 px-6 h-16 sticky top-0 z-30">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <a href="#" className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-md">
              <SquaresPlusIcon className="h-5 w-5 text-white" />
            </div>
            <div className="border-b-2 border-indigo-500 pb-1">
              <span className="text-gray-700 font-semibold text-sm">Admin Dashboard</span>
            </div>
          </a>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Calculator Button */}
          <button
            onClick={() => setShowCalculator(true)}
            className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition"
            title="Open Calculator"
          >
            <CalculatorIcon className="h-5 w-5 text-indigo-600" />
          </button>

          <div className="h-8 border-r border-gray-200" />

          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none group"
              aria-label="User menu"
            >
              <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                AP
              </div>
              <span className="text-gray-600 text-sm hidden sm:block">Admin POS</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-4 px-4 z-50 animate-fade-in space-y-3">
                <div className="flex flex-col items-center text-center">
                  <UserCircleIcon className="h-12 w-12 text-indigo-500 mb-1" />
                  <p className="font-semibold text-sm text-gray-700">Admin POS</p>
                  <p className="text-xs text-gray-500">admin.pos@example.com</p>
                </div>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    localStorage.clear();
                    navigate('/login');
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Calculator Popup */}
      {showCalculator && (
        <div className="absolute top-12 right-4 bg-white rounded-xl shadow-lg w-72 p-2 z-50 animate-fade-in-down">
          <button
            onClick={() => setShowCalculator(false)}
            className="absolute top-1 right-1 text-gray-400 hover:text-red-500 transition"
            title="Close"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
          <Calculator />
        </div>
      )}
    </>
  );
};

export default HorizontalNavbar;
