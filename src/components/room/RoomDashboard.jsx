import React from 'react';

const RoomDashboard = ({ stats, recentPayments, balances, currency = '₹' }) => {
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* --- Top Row: Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Helper Component for Cards */}
        <StatCard label="Total Friends" value={stats.totalFriends} />
        <StatCard label="Total Payments" value={stats.totalPayments} />
        <StatCard 
          label="Total Expenses" 
          value={`${currency}${stats.totalExpenses?.toLocaleString()}`} 
          isHighlighted={true} 
          colorClass="text-emerald-600"
        />
        <StatCard 
          label="Outstanding Balances" 
          value={stats.outstandingBalance} 
          colorClass="text-purple-600"
        />
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column: Recent Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">Recent Payments</h3>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide cursor-pointer hover:underline">View All</span>
          </div>
          
          <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1">
            {recentPayments?.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-lg">
                    {item.payer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {item.payer} <span className="font-normal text-gray-500">paid</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                       {item.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-gray-900">{currency}{item.amount.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Current Balances */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-lg text-gray-900">Current Balances</h3>
          </div>
          
          <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1">
            {balances?.map((person, idx) => {
              const isPositive = person.amount >= 0;
              return (
                <div key={idx} className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isPositive 
                    ? 'bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50' 
                    : 'bg-red-50/40 border-red-100 hover:bg-red-50'
                }`}>
                  {/* Left Accent Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${isPositive ? 'bg-emerald-400' : 'bg-red-400'}`}></div>

                  <div className="flex items-center gap-4 pl-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {person.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-700">{person.name}</span>
                  </div>
                  
                  <div className="text-right">
                    <span className={`block font-bold text-lg ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''} {currency}{person.amount.toFixed(2)}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? 'Gets back' : 'Owes'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

// Simple internal component for the top cards to keep code clean
const StatCard = ({ label, value, colorClass = "text-gray-900", isHighlighted = false }) => (
  <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 ${
    isHighlighted 
      ? 'bg-white border-emerald-100 shadow-lg shadow-emerald-50' 
      : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
  }`}>
    {/* Updated color to gray-500 for better visibility */}
    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</span>
    <span className={`text-3xl font-extrabold ${colorClass}`}>{value}</span>
  </div>
);

export default RoomDashboard;