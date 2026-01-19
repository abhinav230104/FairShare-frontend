import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createRoom, joinRoom, getMyRooms } from '../api/rooms';

// Import sub-components
import Header from '../components/dashboard/Header';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import RoomsGrid from '../components/dashboard/RoomsGrid';
import CreateRoomModal from '../components/dashboard/CreateRoom';
import JoinRoomModal from '../components/dashboard/JoinRoom';     

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- State Management ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Feedback State (Replaces Alerts) ---
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // --- Data Fetching ---
  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const data = await getMyRooms();
      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        setRooms(data.rooms || []);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      setError('Could not load rooms.'); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // --- Helper to clear messages automatically ---
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError('');
        setMessage('');
      }, 5000); // Clear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  // --- Handlers ---
  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setError('Failed to log out.');
    }
  };

  const openCreateModal = () => setIsCreateOpen(true);
  const closeCreateModal = () => setIsCreateOpen(false);

  const openJoinModal = () => setIsJoinOpen(true);
  const closeJoinModal = () => setIsJoinOpen(false);

  const handleCreateRoom = async (roomName) => {
    // Clear previous states
    setError('');
    setMessage('');
    
    try {
      await createRoom(roomName);
      setMessage('Room created successfully!'); // Set success message
      await fetchRooms(); // Refresh grid
    } catch (err) {
      // Extract error message from API if available, or use default
      const errMsg = err.response?.data?.message || 'Failed to create room. Please try again.';
      setError(errMsg);
    }
  };

  const handleJoinRoom = async (roomId) => {
    setError('');
    setMessage('');
    
    try {
      await joinRoom(roomId);
      setMessage('Joined room successfully!'); // Set success message
      await fetchRooms(); // Refresh grid
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to join room. Check the ID.';
      setError(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
    <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top Left Emerald Blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-800/40 rounded-full blur-[120px] opacity-60"></div>
        {/* Bottom Right Purple Blob */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/40 rounded-full blur-[120px] opacity-60"></div>
        {/* Center Subtle Accent */}
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] bg-slate-200/30 rounded-full blur-[100px] opacity-40"></div>
      </div>  
      <Header 
        user={user} 
        onSignOut={handleSignOut} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative">
        
        {/* --- Notification Banners --- */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 animate-fade-in-down">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="font-medium">{error}</span>
            <button onClick={() => setError('')} className="ml-auto hover:text-red-900">✕</button>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 animate-fade-in-down">
             <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="font-medium">{message}</span>
            <button onClick={() => setMessage('')} className="ml-auto hover:text-emerald-900">✕</button>
          </div>
        )}

        <WelcomeSection 
          user={user}
          onCreateClick={openCreateModal}
          onJoinClick={openJoinModal}
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <RoomsGrid 
            rooms={rooms} 
            onCreateClick={openCreateModal}
          />
        )}

      </main>

      {/* --- Modals --- */}
      <CreateRoomModal 
        isOpen={isCreateOpen} 
        onClose={closeCreateModal} 
        onSubmit={handleCreateRoom} 
      />
      
      <JoinRoomModal 
        isOpen={isJoinOpen} 
        onClose={closeJoinModal} 
        onSubmit={handleJoinRoom} 
      />

    </div>
  );
};

export default Dashboard;