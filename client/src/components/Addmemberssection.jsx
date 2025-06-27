import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheckIcon, UserIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

// Password input with toggle visibility
const PasswordInput = ({ id, label, value, onChange, showPassword, onToggleVisibility }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
        aria-label="Toggle password visibility"
      >
        {showPassword ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.392-3.432M9.88 9.88a3 3 0 104.242 4.242M15 12a3 3 0 01-3 3M3 3l18 18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  </div>
);

// User type selection card component
const UserTypeCard = ({ icon: Icon, title, description, color, onClick }) => (
  <button
    onClick={onClick}
    className={`group w-64 p-6 bg-white rounded-xl shadow-md text-left
                hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                border-t-4 ${color}`}
  >
    <Icon className="h-10 w-10 text-gray-500 group-hover:text-indigo-600 transition-colors" />
    <h3 className="mt-4 text-xl font-bold text-gray-800">{title}</h3>
    <p className="mt-1 text-sm text-gray-600">{description}</p>
  </button>
);

const AddMemberssection = () => {
  const [selectedUserType, setSelectedUserType] = useState(null); // 'Admin' or 'Cashier'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserType) {
      alert('Please select a user type (Admin or Cashier)');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      const isAdmin = selectedUserType.toLowerCase() === 'admin';

      console.log('Sending user data:', { email, password, isAdmin });

      const res = await axios.post("http://localhost:5000/api/users", {
        email,
        password,
        isAdmin,
      });

      console.log('Response from server:', res.data);

      alert(`Successfully added ${selectedUserType}:\n${res.data.user.email}`);
      setSelectedUserType(null);
      resetForm();
    } catch (error) {
      console.error('Error adding user:', error);
      alert(error.response?.data?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedUserType) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add a New Member</h1>
        <p className="text-gray-600 mb-10">First, select the type of user you want to add.</p>
        <div className="flex flex-col md:flex-row gap-8">
          <UserTypeCard
            icon={ShieldCheckIcon}
            title="Admin"
            description="Has full access to all features, including settings and user management."
            color="border-blue-500"
            onClick={() => handleUserTypeSelect('Admin')}
          />
          <UserTypeCard
            icon={UserIcon}
            title="Cashier"
            description="Has access only to the billing system and related sales features."
            color="border-green-500"
            onClick={() => handleUserTypeSelect('Cashier')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            Add New {selectedUserType}
          </h2>
          <button
            type="button"
            onClick={() => setSelectedUserType(null)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 font-medium"
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
            <span>Change Type</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="example@mail.com"
            />
          </div>
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding...' : `Add ${selectedUserType}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberssection;
