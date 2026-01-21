import React from 'react';

const RoomBalances = ({ expenses, currentUser }) => {
  // Basic Logic: Total / Everyone
  // (In real app, this logic is complex and handled by backend)
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const youPaid = expenses
    .filter(e => e.payer === currentUser)
    .reduce((sum, item) => sum + item.amount, 0);
  
  // Assuming equal split for visual mock
  // This logic is flawed for real world (depends on # of members), 
  // but fine for UI template.
  const yourShare = totalSpent > 0 ? totalSpent / 4 : 0; 
  const balance = youPaid - yourShare;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      
      {/* Card 1: Total Group Spend */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Spending</p>
        <p className="text-3xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
      </div>

      {/* Card 2: Your Position */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Your Balance</p>
        <div className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {balance >= 0 ? '+' : '-'}₹{Math.abs(balance).toLocaleString()}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {balance >= 0 ? 'You are owed' : 'You owe'}
        </p>
      </div>

      {/* Card 3: Settle Up CTA */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between">
        <div>
          <p className="font-bold text-lg mb-1">All settled?</p>
          <p className="text-emerald-100 text-sm">Clear debts when payments are made.</p>
        </div>
        <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm mt-4 py-2 rounded-lg text-sm font-bold transition-colors">
          Record a Payment
        </button>
      </div>

    </div>
  );
};

export default RoomBalances;