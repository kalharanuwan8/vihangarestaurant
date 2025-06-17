import React, { useState, Fragment } from 'react';
import Sidebar from '../components/Sidebar'; // Assuming this component exists
import HorizontalNavbar from '../components/HorizontalNavbar'; // Assuming this component exists
import {
  UserCircleIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react'; // `npm install @headlessui/react`

// --- Helper Components (would be in separate files in a real app) ---

// A more visually appealing notification toast instead of alert()
const Notification = ({ show, message, onClose }) => (
  <Transition
    as={Fragment}
    show={show}
    enter="transform ease-out duration-300 transition"
    enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enterTo="translate-y-0 opacity-100 sm:translate-x-0"
    leave="transition ease-in duration-100"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div className="fixed top-20 right-8 max-w-sm w-full bg-green-500 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="inline-flex text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
);

// --- Settings Section Components ---

const ProfileSection = ({ showNotification }) => {
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showNotification('Profile updated successfully!');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Public Profile</h2>
      <p className="text-slate-500 mb-8">Update your photo and personal details here.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
              {profilePic ? (
                <img src={profilePic} alt="Profile preview" className="object-cover w-full h-full" />
              ) : (
                <UserCircleIcon className="h-20 w-20 text-slate-400" />
              )}
            </div>
            <label
              htmlFor="profilePicUpload"
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
              title="Change picture"
            >
              <CameraIcon className="w-4 h-4" />
            </label>
            <input id="profilePicUpload" type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input id="name" type="text" defaultValue="Admin POS" className="mt-1 w-full max-w-xs border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
          <input id="email" type="email" defaultValue="admin.pos@example.com" className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="text-right">
          <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform active:scale-95">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const ChangePasswordSection = ({ showNotification }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic here
    showNotification('Password has been changed!');
  };

  const renderPasswordInput = (id, label, show, toggleShow) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative mt-1">
        <input id={id} type={show ? 'text' : 'password'} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <button type="button" onClick={() => toggleShow(!show)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
          {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Change Password</h2>
      <p className="text-slate-500 mb-8">For your security, we recommend choosing a strong password that you don't use elsewhere.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderPasswordInput('currentPassword', 'Current Password', showCurrent, setShowCurrent)}
        {renderPasswordInput('newPassword', 'New Password', showNew, setShowNew)}
        <div className="text-right">
          <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform active:scale-95">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

// --- The Main Settings Page Component ---

const Settings = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('profile'); // Default to 'profile'
  const [notification, setNotification] = useState({ show: false, message: '' });

  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);
  
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
      // Add real logout logic here
    }
  };

  const menuItems = [
    { key: 'profile', label: 'Profile', icon: UserCircleIcon, description: 'Manage your personal information.' },
    { key: 'changePassword', label: 'Change Password', icon: KeyIcon, description: 'Update your security settings.' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection showNotification={showNotification} />;
      case 'changePassword':
        return <ChangePasswordSection showNotification={showNotification} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex bg-slate-100">
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'ml-52' : 'ml-20'}`}>
          <HorizontalNavbar />

          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Left Navigation */}
              <aside className="md:col-span-1">
                <nav className="flex flex-col space-y-2">
                  {menuItems.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
                      className={`flex items-start text-left p-3 rounded-lg transition-all duration-200 ${
                        activeSection === item.key
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                      }`}
                    >
                      <item.icon className={`h-6 w-6 mt-0.5 flex-shrink-0 ${activeSection === item.key ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <div className="ml-3">
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-xs">{item.description}</p>
                      </div>
                    </button>
                  ))}
                  {/* Logout Button - separated for emphasis and safety */}
                  <hr className="my-4"/>
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                    <span className="ml-3 font-semibold">Logout</span>
                  </button>
                </nav>
              </aside>
              
              {/* Right Content Area */}
              <div className="md:col-span-3">
                {renderSection()}
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Notification Toast Area */}
      <Notification 
        show={notification.show}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </>
  );
};

export default Settings;