import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomHeader = ({ roomName, roomId, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'friends', label: 'Friends' },
    { id: 'payments', label: 'Payments' },
    { id: 'settlements', label: 'Settlements' },
    { id: 'reports', label: 'Reports' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    // Reset the text back to "Copy ID" after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 border-b border-emerald-700 shadow-md z-30 sticky top-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* --- Back & Identity --- */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-4 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full text-emerald-100 hover:text-white hover:bg-white/20 transition-all"
              title="Back to Dashboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>

            <div>
              <h1 className="text-3xl font-bold text-white leading-tight drop-shadow-sm truncate max-w-[250px] sm:max-w-md">
                {roomName}
              </h1>
              
              {/* Copy ID Section */}
              <div 
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs text-emerald-100 cursor-pointer hover:text-white transition-colors mt-1 group w-fit select-none"
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

        {/* --- Navigation Tabs --- */}
        {/* Changed: justify-start (for mobile scroll) -> md:justify-center (for desktop center) */}
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

export default RoomHeader;