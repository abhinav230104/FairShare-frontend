import React, { useEffect, useState } from 'react';
import { createRoom } from '../api/rooms';

const CreateRoomModal = ({ isOpen, onClose, onSubmit }) => {
  
  const [isVisible, setIsVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  // Handle Animation on Open/Close
  useEffect(() => {
    if (isOpen) {
      setRoomName(''); // Reset input
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    onSubmit(roomName);
    handleClose();
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4 ${!isOpen ? 'pointer-events-none' : ''}`}>
      
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative transform transition-all duration-300 ease-out ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95'
        }`}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-4">
            ✨
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a New Room</h2>
          <p className="text-gray-500 mb-6">
            Give your group a name to get started. You can add expenses immediately after.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
              <input 
                type="text" 
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Goa Trip 2026"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                required
                autoFocus
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 mt-2"
            >
              Create Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;