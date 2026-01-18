import React from 'react';

const WelcomeSection = ({ user, onCreateClick, onJoinClick }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, <span className="text-emerald-600">{user?.name || 'Friend'}</span>!
        </h1>
        <p className="text-gray-500 flex items-center gap-2">
          Your FairShare ID: 
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium select-all">
            {user?.userId|| 'LOADING...'}
          </span>
        </p>
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <button 
          onClick={onJoinClick}
          className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
        >
          Join Room
        </button>
        <button 
          onClick={onCreateClick}
          className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 transform hover:-translate-y-0.5"
        >
          + Create Room
        </button>
      </div>

    </div>
  );
};

export default WelcomeSection;