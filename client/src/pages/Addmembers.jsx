import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import HorizontalNavbar from '../components/HorizontalNavbar';
import AddMemberssection from '../components/Addmemberssection';

const Addmembers = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert(`Successfully added ${selectedUserType}:\n${email}`);
    setSelectedUserType(null);
    resetForm();
  };

 return(
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
            <div className='flex flex-col items-center bg-white p-4 sm:p-6 rounded-lg shadow-md '>
                <AddMemberssection/>
            </div>
            </main>
        </div>
        </div>
 )
};

export default Addmembers;
