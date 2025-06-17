import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import HorizontalNavbar from '../components/HorizontalNavbar';

const MainLayout = () => {
    const [isSidebarExpanded, setSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div className="relative min-h-screen flex bg-gray-100">
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'ml-52' : 'ml-20'}`}>
                <HorizontalNavbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Outlet /> {/* Child routes (Dashboard, BillingCart) will render here */}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;