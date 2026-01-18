import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import sub-components
import Header from '../components/dashboard/Header';
import RoomHeader from '../components/room/RoomHeader';
import RoomDashboard from '../components/room/RoomDashboard';

// Placeholders
const FriendsTab = () => <div className="p-8 text-center text-gray-500 font-medium bg-white/50 rounded-xl backdrop-blur-sm">Friends List Component Coming Soon</div>;
const PaymentsTab = () => <div className="p-8 text-center text-gray-500 font-medium bg-white/50 rounded-xl backdrop-blur-sm">Payments History Component Coming Soon</div>;
const SettlementsTab = () => <div className="p-8 text-center text-gray-500 font-medium bg-white/50 rounded-xl backdrop-blur-sm">Settlements Component Coming Soon</div>;
const ReportsTab = () => <div className="p-8 text-center text-gray-500 font-medium bg-white/50 rounded-xl backdrop-blur-sm">Reports & Graphs Component Coming Soon</div>;

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // --- State ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Mock Fetch ---
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        await new Promise(r => setTimeout(r, 600)); 
        
        setRoomData({
          id: roomId,
          name: 'Goa Trip 2026',
          currency: '₹',
          stats: {
            totalFriends: 8,
            totalPayments: 86,
            totalExpenses: 34470.27,
            outstandingBalance: 6 
          },
          recentPayments: [
            { id: 1, payer: 'Karan', amount: 0.69, date: '2025-12-23', category: 'General' },
            { id: 2, payer: 'Preet', amount: 0.50, date: '2025-12-23', category: 'General' },
            { id: 3, payer: 'Preet', amount: 0.81, date: '2025-12-23', category: 'General' },
            { id: 4, payer: 'Preet', amount: 0.08, date: '2025-12-23', category: 'General' },
            { id: 5, payer: 'Karan', amount: 598.00, date: '2025-12-23', category: 'General' },
          ],
          balances: [
            { name: 'Abhinav', amount: 480.42 },
            { name: 'Rishabh', amount: -480.42 },
            { name: 'Harsh', amount: -722.42 },
            { name: 'Vishal', amount: -652.50 },
            { name: 'Karan', amount: -0.03 },
            { name: 'Abhay', amount: 1374.92 },
          ]
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen font-sans text-gray-900 relative bg-gray-50 overflow-hidden">
      
      {/* --- Background Decorative Blobs --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top Left Emerald Blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/40 rounded-full blur-[120px] opacity-60"></div>
        {/* Bottom Right Purple Blob */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px] opacity-60"></div>
        {/* Center Subtle Accent */}
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] bg-slate-200/30 rounded-full blur-[100px] opacity-40"></div>
      </div>

      {/* --- Main Content (Relative z-10 to sit above background) --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* 1. Global Header */}
        <Header user={user} onSignOut={logout} />

        {/* 2. Room Navigation Header */}
        <RoomHeader 
          roomName={roomData.name} 
          roomId={roomData.id} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* 3. Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in">
          
          {activeTab === 'dashboard' && (
            <RoomDashboard 
              stats={roomData.stats} 
              recentPayments={roomData.recentPayments} 
              balances={roomData.balances} 
              currency={roomData.currency}
            />
          )}
          
          {activeTab === 'friends' && <FriendsTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'settlements' && <SettlementsTab />}
          {activeTab === 'reports' && <ReportsTab />}

        </main>
      </div>

    </div>
  );
};

export default RoomDetails;