import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- API Imports ---
import { getRoomDetails, deleteRoom, updateRoomName, leaveRoom } from '../api/rooms';
import { getExpenses, getBalances, getSettlements } from '../api/expenses'; 

// Import sub-components
import Header from '../components/dashboard/Header';
import RoomHeader from '../components/room/RoomHeader';
import RoomDashboard from '../components/room/RoomDashboard';
import FriendsTab from '../components/room/FriendsTab';
import PaymentsTab from '../components/room/PaymentsTab';
import SettlementsTab from '../components/room/SettlementsTab';
// Placeholders
const ReportsTab = () => <div className="p-8 text-center text-gray-500 font-medium bg-white/50 rounded-xl backdrop-blur-sm">Reports & Graphs Component Coming Soon</div>;

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // --- State ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Feedback
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // --- SEPARATE LOADING STATES ---
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false); 

  // --- Current User Role in Room ---
  const [currentUserRole, setCurrentUserRole] = useState('member');

  // Auto-dismiss toasts
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError('');
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  // --- Fetch Room Data ---
  const fetchAllData = useCallback(async () => {
    try {
      if (!roomData) setLoading(true);
      setError('');

      const [roomDetails, expenseList, rawBalances, settlements] = await Promise.all([
        getRoomDetails(roomId),
        getExpenses(roomId),
        getBalances(roomId),
        getSettlements(roomId)
      ]);

      // Determine User Role
      if (roomDetails.members && user) {
        const me = roomDetails.members.find(m => 
          m.user?._id === user._id || m.user === user._id || 
          m.user?.userId === user.userId 
        );
        setCurrentUserRole(me?.role || 'member');
      }

      // Member Map
      const memberMap = {};
      if (roomDetails.members) {
        roomDetails.members.forEach(m => {
          const uId = m.user?._id || m.user;
          const uName = m.user?.name || 'Unknown User';
          if (uId) memberMap[uId.toString()] = uName;
        });
      }

      // Format Balances
      const formattedBalances = Object.entries(rawBalances).map(([userId, amount]) => ({
        name: memberMap[userId] || 'Unknown',
        amount: Number(amount),
        userId: userId
      }));

      // Stats
      const totalExpenses = expenseList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      // const myBalanceAmount = user?._id && rawBalances[user._id] ? Number(rawBalances[user._id]) : 0;

      const formatDate = (dateString) => {
          try {
              if (!dateString) return new Date().toISOString().split('T')[0];
              const date = new Date(dateString);
              if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
              return date.toISOString().split('T')[0];
          } catch (e) {
              return new Date().toISOString().split('T')[0];
          }
      };

      setRoomData({
        dbId: roomDetails._id, 
        id: roomDetails.roomId, 
        name: roomDetails.name,
        members: roomDetails.members,
        currency: '₹',
        stats: {
          totalFriends: roomDetails.members ? roomDetails.members.length : 0,
          totalPayments: expenseList.length,
          totalExpenses: totalExpenses,
          outstandingBalance: settlements.length
        },
        recentPayments: expenseList.slice(0, 5).map(exp => ({
            id: exp._id,
            payer: exp.paidBy?.name || memberMap[exp.paidBy?._id] || memberMap[exp.paidBy] || 'Unknown',
            amount: Number(exp.amount),
            date: formatDate(exp.createdAt), 
            category: exp.category || 'General'
        })),
        balances: formattedBalances 
      });

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load room details.");
    } finally {
      setLoading(false);
    }
  }, [roomId, user, roomData]);

  useEffect(() => {
    if (roomId && user) {
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user]);

  // --- Handlers ---
  
  // FIX: Added dedicated Sign Out handler that navigates
  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const handleDeleteRoom = async () => {
    if (!window.confirm("Are you sure you want to delete this room? This cannot be undone.")) return;
    try {
      setIsDeleting(true);
      await deleteRoom(roomId);
      navigate('/dashboard'); 
    } catch (err) {
      setIsDeleting(false);
      setError(err.response?.data?.message || "Failed to delete room.");
    }
  };

  const handleLeaveRoom = async () => {
    if (!window.confirm("Are you sure you want to leave this room?")) return;
    try {
      setIsLeaving(true); 
      await leaveRoom(roomId);
      navigate('/dashboard');
    } catch (err) {
      setIsLeaving(false); 
      setError(err.response?.data?.message || "Failed to leave room.");
    }
  };

  const handleUpdateRoomName = async (newName) => {
    try {
      await updateRoomName(roomId, newName);
      setMessage("Room name updated!");
      setRoomData(prev => ({ ...prev, name: newName }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update room name.");
    }
  };

  const handleViewAllPayments = () => {
    setActiveTab('payments');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!roomData && error) return <div className="p-8 text-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="min-h-screen font-sans text-gray-900 relative bg-gray-50 overflow-hidden">
      
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/40 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] bg-slate-200/30 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {(message || error) && (
            <div className="absolute top-20 left-0 w-full flex justify-center pointer-events-none z-50">
            <div className={`px-4 py-2 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2 animate-fade-in-down ${
                message ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
                <span>{message || error}</span>
            </div>
            </div>
        )}

        {/* Updated Header with handleSignOut */}
        <Header user={user} onSignOut={handleSignOut} />

        <RoomHeader 
          roomName={roomData?.name} 
          roomId={roomData?.id}
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          
          // --- CONDITIONAL ACTIONS ---
          onDelete={currentUserRole === 'admin' ? handleDeleteRoom : null}
          onLeave={handleLeaveRoom}
          
          isDeleting={isDeleting}
          isLeaving={isLeaving}
          
          onEditName={currentUserRole === 'admin' ? handleUpdateRoomName : null} 
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in">
          {activeTab === 'dashboard' && (
            <RoomDashboard 
              stats={roomData.stats} 
              recentPayments={roomData.recentPayments} 
              balances={roomData.balances} 
              currency={roomData.currency}
              onViewAll={handleViewAllPayments}
            />
          )}
          
          {activeTab === 'friends' && (
            <FriendsTab 
              roomId={roomId}
              members={roomData.members}
              onRefresh={fetchAllData} 
            />
          )}
          
          {activeTab === 'payments' && (
            <PaymentsTab 
              roomId={roomId}
              members={roomData.members}
              currentUserRole={currentUserRole}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === 'settlements' && (
            <SettlementsTab 
              roomId={roomId}
              members={roomData.members}
              currentUserRole={currentUserRole}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === 'reports' && <ReportsTab />}
        </main>
      </div>

    </div>
  );
};

export default RoomDetails;