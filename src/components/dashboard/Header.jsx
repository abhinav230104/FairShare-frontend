import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onSignOut }) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-3xl">
              ⚖️
            </div>
            <span className="text-3xl font-bold tracking-tight text-gray-900">FairShare</span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium hidden sm:block">
              {user?.name || 'User'}
            </span>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button 
              onClick={onSignOut}
              className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors ml-2"
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Header;