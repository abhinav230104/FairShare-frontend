import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const { updateUserProfile } = useAuth(); 

  // --- State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  // --- Feedback State ---
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Sync local state with user prop
  useEffect(() => {
    if (user?.name) {
      setEditedName(user.name);
    }
  }, [user]);

  // Auto-dismiss messages
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError('');
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  // --- Handlers ---
  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      await updateUserProfile(editedName);
      
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      
      // Extract error from server response if available
      const serverError = err.response?.data?.message || err.message || "Failed to update name.";
      setError(serverError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError('');
    setEditedName(user?.name || '');
    setIsEditing(false);
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-40 relative">
      
      {/* --- Notification Toast --- */}
      {(message || error) && (
        <div className="absolute top-16 left-0 w-full flex justify-center pointer-events-none z-50">
          <div className={`mt-2 px-4 py-2 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2 animate-fade-in-down ${
            message ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <span>{message || error}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl sm:text-3xl">
              ⚖️
            </div>
            {/* FIX: Smaller font (text-xl) on mobile, larger (text-3xl) on desktop */}
            <span className="text-xl sm:text-3xl font-bold tracking-tight text-gray-900">FairShare</span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Editable Name Section */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                // Edit Mode
                <div className="flex items-center gap-1 animate-fade-in">
                  <input 
                    type="text" 
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    // --- CHANGED: Attributes to disable spellcheck/grammar lines ---
                    spellCheck="false"
                    autoComplete="off"
                    data-gramm="false"
                    className={`border rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 w-24 sm:w-32 ${
                      error ? 'border-red-300 focus:ring-red-500' : 'border-emerald-300 focus:ring-emerald-500'
                    }`}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  <button 
                    onClick={handleSaveName} 
                    disabled={isLoading}
                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded disabled:opacity-50"
                    title="Save"
                  >
                    {isLoading ? '...' : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    )}
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="p-1 text-red-400 hover:bg-red-50 rounded"
                    title="Cancel"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center gap-2 group">
                  <span className="text-gray-700 font-medium text-sm sm:text-base max-w-[100px] sm:max-w-none truncate">
                    {user?.name || 'User'} 
                  </span>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-emerald-600 transition-colors p-1"
                    title="Edit Name"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Sign Out */}
            <button 
             onClick={onSignOut}
             className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors ml-1 sm:ml-2"
             title="Sign Out"
            >
            {/* Text for Desktop */}
            <span className="hidden sm:inline">Sign Out</span>
  
            {/* Icon for Mobile (Saves space) */}
            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Header;