    import React, { useState } from 'react';
    import Sidebar from '../components/Sidebar';
    import HorizontalNavbar from '../components/HorizontalNavbar';
    import Dashboard from '../components/Dashboard';

    function Admin() {
    // State to manage whether the sidebar is expanded or collapsed
    const [isSidebarExpanded, setSidebarExpanded] = useState(true);

    // Function to toggle the sidebar state
    const toggleSidebar = () => {
        setSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div className="relative min-h-screen flex bg-gray-100">
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

        {/* Main content area that adjusts its margin based on the sidebar's state */}
        <div 
            className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarExpanded ? 'ml-52' : 'ml-20' // Matches the expanded/collapsed widths of the sidebar
            }`}
        >
            <HorizontalNavbar />
            
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <Dashboard />
            </main>
        </div>
        </div>
    );
    }

    export default Admin;