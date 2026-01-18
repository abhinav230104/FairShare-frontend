import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import sub-components
import RoomHeader from '../components/room/RoomHeader';
import RoomBalances from '../components/room/RoomBalances';
import ExpensesList from '../components/room/ExpensesList';
import AddExpenseModal from '../components/room/AddExpenseModal';

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // --- State ---
  const [room, setRoom] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // --- Mock Fetch (Replace with API later) ---
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRoom({
        id: roomId,
        name: 'Goa Trip 2026',
        members: ['You', 'Alex', 'Sam', 'Priya'],
        currency: '₹'
      });

      setExpenses([
        { id: 1, title: 'Flight Tickets', amount: 12000, payer: 'You', date: '2026-01-10' },
        { id: 2, title: 'Hotel Booking', amount: 8000, payer: 'Alex', date: '2026-01-11' },
        { id: 3, title: 'Dinner & Drinks', amount: 4500, payer: 'Sam', date: '2026-01-12' },
      ]);
      setLoading(false);
    }, 800);
  }, [roomId]);

  // --- Handlers ---
  const handleAddExpense = (newExpense) => {
    // In real app: API call -> then update state
    const expense = {
      id: Date.now(),
      ...newExpense,
      payer: 'You', // Assuming 'You' added it for now
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([expense, ...expenses]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      <RoomHeader 
        roomName={room.name} 
        roomId={room.id} 
        onBack={() => navigate('/dashboard')} 
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Top Section: Balances */}
        <RoomBalances 
          expenses={expenses} 
          currentUser="You" 
        />

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Expenses</h2>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
          >
            <span>+ Add Expense</span>
          </button>
        </div>

        {/* List */}
        <ExpensesList 
          expenses={expenses} 
          currentUser="You" 
          currency={room.currency}
        />

      </main>

      {/* Modals */}
      <AddExpenseModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={handleAddExpense} 
        members={room.members}
      />

    </div>
  );
};

export default RoomDetails;