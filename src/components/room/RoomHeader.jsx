import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomHeader = ({ 
  roomName, 
  roomId, 
  activeTab, 
  setActiveTab, 
  onDelete, 
  onLeave, 
  isDeleting, // Prop for Delete loading state
  isLeaving,  // Prop for Leave loading state
  onEditName 
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(roomName || '');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'friends', label: 'Friends' },
    { id: 'payments', label: 'Payments' },
    { id: 'settlements', label: 'Settlements' },
    { id: 'reports', label: 'Reports' },
  ];

  // Update local state if prop changes
  useEffect(() => {
    setEditedName(roomName || '');
  }, [roomName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveEdit = () => {
    if (editedName.trim() && editedName !== roomName) {
      onEditName(editedName);
    }
    setIsEditing(false);
  };

  // Helper to check if any action is processing (to disable buttons)
  const isProcessing = isDeleting || isLeaving;

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 border-b border-emerald-700 shadow-md z-30 sticky top-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 gap-4">
          
          {/* --- Left: Back & Title --- */}
          <div className="flex items-start gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-1 p-2 rounded-full text-emerald-100 hover:text-white hover:bg-white/20 transition-all flex-shrink-0"
              title="Back to Dashboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>

            <div className="flex flex-col w-full">
              {isEditing ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-white/10 border border-emerald-400/50 rounded px-2 py-1 text-2xl font-bold text-white focus:outline-none focus:bg-white/20 w-full"
                    autoFocus
                    spellCheck="false"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                  />
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={saveEdit} className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                    <button onClick={() => setIsEditing(false)} className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 group w-full">
                  <h1 className="text-3xl font-bold text-white leading-tight drop-shadow-sm break-words">
                    {roomName}
                  </h1>
                  {onEditName && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="mt-1.5 text-emerald-200/70 hover:text-white transition-all flex-shrink-0"
                      title="Edit Room Name"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 mt-1">
                <div 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-xs text-emerald-100 cursor-pointer hover:text-white transition-colors group select-none"
                >
                  <span className="font-mono bg-black/20 px-2 py-0.5 rounded text-emerald-50 group-hover:bg-black/30 transition-colors border border-emerald-500/30">
                    #{roomId}
                  </span>
                  <span className={`transition-all duration-300 uppercase font-bold tracking-wide ${
                    copied ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {copied ? 'Copied! ✓' : 'Copy ID'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Actions: Delete AND/OR Leave --- */}
          <div className="flex-shrink-0 ml-auto md:ml-0 flex flex-col sm:flex-row gap-2">
             
             {/* Leave Button */}
             {onLeave && (
                <button 
                  onClick={onLeave}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-100 hover:text-white border border-amber-500/30 rounded-lg transition-all text-sm font-bold backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLeaving ? <Spinner /> : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  )}
                  {isLeaving ? 'Leaving...' : 'Leave Room'}
                </button>
             )}

             {/* Delete Button */}
             {onDelete && (
                <button 
                  onClick={onDelete}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-100 hover:text-white border border-red-500/30 rounded-lg transition-all text-sm font-bold backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? <Spinner /> : <TrashIcon />}
                  {isDeleting ? 'Deleting...' : 'Delete Room'}
                </button>
             )}
          </div>

        </div>

        {/* --- Tabs --- */}
        <div className="flex overflow-x-auto overflow-y-hidden no-scrollbar justify-start md:justify-center gap-2 sm:gap-6 mt-4 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-4 text-base font-bold transition-all whitespace-nowrap outline-none rounded-t-lg flex-shrink-0
                ${activeTab === tab.id 
                  ? 'bg-white text-emerald-700 shadow-sm translate-y-[1px]' 
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white border-transparent'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

// Helper Icons
const Spinner = () => <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

export default RoomHeader;