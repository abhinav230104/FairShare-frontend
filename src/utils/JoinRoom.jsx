import React, { useEffect, useState } from 'react';

const JoinRoomModal = ({ isOpen, onClose, onSubmit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [roomId, setRoomId] = useState('');

  // Handle Animation on Open/Close
  useEffect(() => {
    if (isOpen) {
      setRoomId(''); // Reset input
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
    if (!roomId.trim()) return;
    onSubmit(roomId);
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
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
            🔗
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join an Existing Room</h2>
          <p className="text-gray-500 mb-6">
            Enter the Room ID shared by your friend to access the group expenses.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
              <input 
                type="text" 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="e.g. RM-8821"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all uppercase tracking-wide"
                required
                autoFocus
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 mt-2"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;