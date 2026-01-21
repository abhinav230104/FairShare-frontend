import React, { useMemo } from 'react';

const ReportsTab = ({ expenses = [], settlements = [], members = [] }) => {

  // --- 1. Build a Master Map of IDs -> Names ---
  // This fixes the "Unknown" issue by harvesting names from the history
  const nameMap = useMemo(() => {
    const map = {};

    // A. Add Active Members
    members.forEach(m => {
      const id = m.user?._id || m.user;
      const name = m.user?.name;
      if (id) map[id] = name;
    });

    // B. Scan Expenses for missing names (People who left)
    expenses.forEach(exp => {
      // Check Payer
      const payer = exp.paidBy;
      if (payer && payer._id && !map[payer._id]) {
        map[payer._id] = `${payer.name} (Left)`;
      }
      
      // Check Split Participants
      if (exp.shares) {
        exp.shares.forEach(s => {
          const u = s.user;
          if (u && u._id && !map[u._id]) {
            map[u._id] = `${u.name} (Left)`;
          }
        });
      }
    });

    // C. Scan Settlements
    settlements.forEach(s => {
      if (s.from && s.from._id && !map[s.from._id]) map[s.from._id] = `${s.from.name} (Left)`;
      if (s.to && s.to._id && !map[s.to._id]) map[s.to._id] = `${s.to.name} (Left)`;
    });

    return map;
  }, [members, expenses, settlements]);

  // Helper to safely get name from Map
  const getName = (idOrObj) => {
    const id = idOrObj?._id || idOrObj;
    return mapIdToName(id);
  };

  const mapIdToName = (id) => {
    if (!id) return 'Unknown';
    return nameMap[id] || 'Former Member';
  };

  // --- Calculations ---
  const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalPayments = expenses.length;
  // Use the map size to approximate member count for history, or just active members
  const memberCount = members.length || 1; 
  const avgPerPerson = (totalExpenses / memberCount).toFixed(2);

  // Group by Category
  const byCategory = expenses.reduce((acc, item) => {
    const cat = item.category || 'General';
    acc[cat] = (acc[cat] || 0) + Number(item.amount);
    return acc;
  }, {});

  // Group by User (Payer)
  const byUser = expenses.reduce((acc, item) => {
    const payerId = item.paidBy?._id || item.paidBy; 
    if (payerId) {
      acc[payerId] = (acc[payerId] || 0) + Number(item.amount);
    }
    return acc;
  }, {});
  
  // --- FIX: Consistent Date Formatter ---
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    
    // Force DD-MM-YYYY format
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const year = d.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  // --- CSV Download Logic ---
  const handleDownloadCSV = () => {
    const csvRows = [];
    
    // Header
    csvRows.push(['Payment No.', 'Date', 'Title', 'Category', 'Payer', 'Participants', 'Amount (INR)']);

    // Expenses Data
    expenses.forEach((exp, index) => {
      const paymentNo = index + 1;
// FIX: Use the custom formatter instead of toLocaleDateString
      const date = formatDate(exp.createdAt);      
      const payerId = exp.paidBy?._id || exp.paidBy;
      const payerName = mapIdToName(payerId);
      
      const title = `"${exp.title.replace(/"/g, '""')}"`; 

      // Get Participants names
      let participantsStr = "All Members";
      // We can use the smart check here too if you want, 
      // but listing names is safest for a static report
      if (exp.shares && exp.shares.length > 0) {
         const names = exp.shares.map(s => mapIdToName(s.user?._id || s.user));
         participantsStr = names.join(" & ");
      }
      const participantsSafe = `"${participantsStr.replace(/"/g, '""')}"`;
      
      csvRows.push([paymentNo, date, title, exp.category, payerName, participantsSafe, exp.amount]);
    });

    // Add Settlements Section
    csvRows.push([]); 
    csvRows.push(['--- SETTLEMENTS ---']);
    csvRows.push(['From', 'To', 'Amount (INR)']);
    
    settlements.forEach(s => {
      const fromName = mapIdToName(s.from?._id || s.from);
      const toName = mapIdToName(s.to?._id || s.to);
      csvRows.push([fromName, toName, s.amount]);
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "room_expense_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxCatValue = Math.max(...Object.values(byCategory), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Expense Report</h2>
          <p className="text-sm text-gray-500">Overview of spending and distribution</p>
        </div>
        <button 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Expenses</span>
          <span className="text-3xl font-bold text-gray-900 mt-1">₹{totalExpenses}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg. Per Person</span>
          <span className="text-3xl font-bold text-emerald-600 mt-1">₹{avgPerPerson}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Payments</span>
          <span className="text-3xl font-bold text-blue-600 mt-1">{totalPayments}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- Expenses by Category --- */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Expenses by Category</h3>
          <div className="space-y-4">
            {Object.keys(byCategory).length > 0 ? (
              Object.entries(byCategory)
                .sort(([,a], [,b]) => b - a) 
                .map(([cat, amount]) => {
                  const percentage = maxCatValue > 0 ? (amount / maxCatValue) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600">{cat}</span>
                        <span className="font-bold text-gray-900">₹{amount}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
              })
            ) : (
              <p className="text-center text-gray-400 py-4">No data available</p>
            )}
          </div>
        </div>

        {/* --- Expenses by User --- */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Who Paid What</h3>
          <div className="space-y-4">
            {Object.entries(byUser)
              .sort(([,a], [,b]) => b - a)
              .map(([userId, amount]) => {
                const name = mapIdToName(userId);
                return (
                  <div key={userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white text-emerald-600 font-bold flex items-center justify-center border border-gray-200 shadow-sm text-xs">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700">{name}</span>
                    </div>
                    <span className="font-bold text-gray-900">₹{amount}</span>
                  </div>
                );
            })}
             {Object.keys(byUser).length === 0 && (
               <p className="text-center text-gray-400 py-4">No payments yet</p>
             )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportsTab;