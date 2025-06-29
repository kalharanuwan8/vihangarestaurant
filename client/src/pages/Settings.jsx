// src/pages/Settings.jsx
import React, { useState, Fragment } from 'react';
import Sidebar from '../components/Sidebar';
import HorizontalNavbar from '../components/HorizontalNavbar';
import {
  UserCircleIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

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
            <button onClick={onClose} className="inline-flex text-white rounded-md">×</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
);

const ProfileSection = ({ showNotification }) => {
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showNotification('Profile updated successfully!');
  };

  const storedUser = JSON.parse(localStorage.getItem('userData'));

  return (
    <div className="bg-white shadow-md rounded-lg p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Public Profile</h2>
      <p className="text-slate-500 mb-8">Update your photo and personal details here.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
              {profilePic ? <img src={profilePic} alt="Profile preview" className="object-cover w-full h-full" /> : <UserCircleIcon className="h-20 w-20 text-slate-400" />}
            </div>
            <label htmlFor="profilePicUpload" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer">
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
          <input
            id="email"
            type="email"
            defaultValue={storedUser?.email || ''}
            className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="text-right">
          <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userData'));
    const email = user?.email;
    if (!email) return alert('User not found');

    try {
      const res = await fetch('http://localhost:5000/api/auth/  changepassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, oldPassword: currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showNotification('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert(err.message);
    }
  };

  const renderInput = (id, label, value, onChange, show, toggleShow) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative mt-1">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button type="button" onClick={() => toggleShow(!show)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
          {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderInput('currentPassword', 'Current Password', currentPassword, setCurrentPassword, showCurrent, setShowCurrent)}
        {renderInput('newPassword', 'New Password', newPassword, setNewPassword, showNew, setShowNew)}
        <div className="text-right">
          <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

const Settings = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [notification, setNotification] = useState({ show: false, message: '' });

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const menuItems = [
    { key: 'profile', label: 'Profile', icon: UserCircleIcon },
    { key: 'changePassword', label: 'Change Password', icon: KeyIcon },
  ];

  return (
    <>
      <div className="relative min-h-screen flex bg-slate-100">
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={() => setSidebarExpanded(!isSidebarExpanded)} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'ml-52' : 'ml-20'}`}>
          <HorizontalNavbar />
          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <aside className="md:col-span-1">
                <nav className="flex flex-col space-y-2">
                  {menuItems.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
                      className={`flex items-center p-3 rounded-lg ${activeSection === item.key ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
                    >
                      <item.icon className="h-6 w-6 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                  <hr className="my-4" />
                  <button
                    onClick={() => {
                      if (window.confirm('Logout?')) {
                        localStorage.removeItem('userData');
                        window.location.href = '/';
                      }
                    }}
                    className="flex items-center p-3 rounded-lg text-red-600 hover:bg-red-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </aside>
              <div className="md:col-span-3">
                {activeSection === 'profile' && <ProfileSection showNotification={showNotification} />}
                {activeSection === 'changePassword' && <ChangePasswordSection showNotification={showNotification} />}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Notification show={notification.show} message={notification.message} onClose={() => setNotification({ ...notification, show: false })} />
    </>
  );
};

export default Settings;
