import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomsGrid = ({ rooms, onCreateClick }) => {
  const navigate = useNavigate();

  if (rooms.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
        <p className="text-gray-400 mb-4">You aren't part of any rooms yet.</p>
        <button onClick={onCreateClick} className="text-emerald-600 font-bold hover:underline">
          Create one now
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 px-1">Your Rooms</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div 
            key={room.roomId}
            onClick={() => navigate(`/room/${room.roomId}`)}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          >
            {/* Hover Icon Effect */}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-emerald-500 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {room.name}
                </h3>
              </div>
              
              <div className="space-y-1 mb-6">
                <p className="text-sm text-gray-500">ID: {room.roomId}</p>
                <p className="text-sm text-gray-500">Members: {room.members} </p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Role</span>
                <span className={`font-bold 'text-emerald-600' capitalize`}>
                  {room.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsGrid;