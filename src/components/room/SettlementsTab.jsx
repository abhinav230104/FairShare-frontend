import React, { useState, useEffect } from 'react';
import { getSettlements, addExpense } from '../../api/expenses';
import { useAuth } from '../../contexts/AuthContext';

const SettlementsTab = ({ roomId, members = [], currentUserRole, onRefresh }) => {
  const { user } = useAuth();
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const data = await getSettlements(roomId);
      setSettlements(data);
    } catch (err) {
      console.error("Failed to load settlements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, [roomId]);

  const handleSettleUp = async (settlement) => {
    // settlement object structure: { from: userId, to: userId, amount: number }
    
    if (!window.confirm(`Mark this debt of ₹${settlement.amount} as settled?`)) return;

    try {
      // Create a unique ID for the button loader
      const uniqueId = `${settlement.from}-${settlement.to}`;
      setProcessingId(uniqueId);

      // Construct the "Settlement" expense payload
      // Logic: Debtor (from) pays the Creditor (to).
      // If Debtor pays, and Creditor is the only participant, the math cancels out.
      const payload = {
        roomId,
        title: 'Settlement',
        amount: Number(settlement.amount),
        category: 'Settlement',
        payer: settlement.from,      // The person who owes money PAYS
        participants: [settlement.to] // The person who receives money is the "consumer" of this payment value
      };

      await addExpense(payload);
      
      // Refresh local list and global stats
      await fetchSettlements();
      if (onRefresh) onRefresh();

    } catch (err) {
      console.error(err);
      alert("Failed to settle debt.");
    } finally {
      setProcessingId(null);
    }
  };

  const getName = (id) => {
    const m = members.find(m => m.user?._id === id || m.user === id);
    return m ? (m.user?.name || 'Unknown') : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Settlements</h2>
        <p className="text-sm text-gray-500">Suggested payments to balance the group</p>
      </div>

      {settlements.length > 0 ? (
        <div className="space-y-4">
          {settlements.map((item, idx) => {
            const fromName = getName(item.from);
            const toName = getName(item.to);
            const uniqueId = `${item.from}-${item.to}`;
            
            // Allow settlement if: Admin, Current User is Payer, or Current User is Payee
            const canSettle = 
                currentUserRole === 'admin' || 
                user?._id === item.from || 
                user?._id === item.to;

            return (
              <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-all relative overflow-hidden group">
                
                {/* Decorative Background Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-xl"></div>

                {/* --- Visual Flow: User A -> Amount -> User B --- */}
                <div className="flex items-center gap-4 sm:gap-8 w-full justify-center sm:justify-start">
                  
                  {/* Debtor (From) */}
                  <div className="flex flex-col items-center gap-1 min-w-[80px]">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                      {fromName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">{fromName}</span>
                  </div>

                  {/* Arrow & Amount */}
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pays</span>
                    <div className="relative flex items-center w-full max-w-[120px]">
                       <div className="h-[2px] w-full bg-gray-200"></div>
                       <svg className="absolute right-0 w-4 h-4 text-gray-300 -mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </div>
                    <span className="text-lg font-bold text-emerald-600 mt-1">₹{item.amount}</span>
                  </div>

                  {/* Creditor (To) */}
                  <div className="flex flex-col items-center gap-1 min-w-[80px]">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                      {toName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">{toName}</span>
                  </div>

                </div>

                {/* --- Action Button --- */}
                {canSettle && (
                  <button
                    onClick={() => handleSettleUp(item)}
                    disabled={processingId === uniqueId}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:scale-100"
                  >
                    {processingId === uniqueId ? 'Settling...' : 'Mark Paid'}
                  </button>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
             <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">All Settled Up!</h3>
          <p className="text-gray-500 max-w-sm">
            No one owes anything. Everyone is square. Time to plan the next expense!
          </p>
        </div>
      )}
    </div>
  );
};

export default SettlementsTab;