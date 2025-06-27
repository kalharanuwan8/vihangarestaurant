import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import HorizontalNavbar from '../components/HorizontalNavbar';
import AddMemberssection from '../components/Addmemberssection';
import MemberDetails from '../components/MemberDetails';

const Addmembers = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'ml-52' : 'ml-20'
        }`}
      >
        <HorizontalNavbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="flex flex-col items-center bg-white p-4 sm:p-6 rounded-lg shadow-md ">
            <AddMemberssection />
          </div>
           
        </main>
        <div className="flex flex-col items-center bg-white p-4 sm:p-6 rounded-lg shadow-md ">
            <MemberDetails />
          </div>
      </div>
    </div>
  );
};

export default Addmembers;
