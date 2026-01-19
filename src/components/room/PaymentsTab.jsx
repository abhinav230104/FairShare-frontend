import React, { useState, useEffect } from 'react';
import { getExpenses, addExpense, deleteExpense } from '../../api/expenses';
import { useAuth } from '../../contexts/AuthContext';

const PaymentsTab = ({ roomId, members = [], currentUserRole, onRefresh }) => {
  const { user } = useAuth();
  
  // --- State ---
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add Expense State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'General',
    paidBy: user?._id, 
    participants: []   
  });
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = currentUserRole === 'admin';

  // Initialize participants with ALL members when opening form
  useEffect(() => {
    if (isAdding && members.length > 0) {
      setFormData(prev => ({
        ...prev,
        participants: members.map(m => m.user?._id || m.user)
      }));
    }
  }, [isAdding, members]);

  // --- Fetch Expenses ---
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses(roomId);
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setExpenses(sorted);
    } catch (err) {
      console.error(err);
      setError('Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [roomId]);

  // --- Handlers ---
  const handleParticipantToggle = (userId) => {
    setFormData(prev => {
      const current = prev.participants;
      if (current.includes(userId)) {
        return { ...prev, participants: current.filter(id => id !== userId) };
      } else {
        return { ...prev, participants: [...current, userId] };
      }
    });
  };

  const handleSelectAll = () => {
    const allMemberIds = members.map(m => m.user?._id || m.user);
    setFormData(prev => {
      const isAllSelected = prev.participants.length === allMemberIds.length;
      return {
        ...prev,
        participants: isAllSelected ? [] : allMemberIds
      };
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    if (formData.participants.length === 0) {
      alert("Please select at least one participant.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { 
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category || 'General',
        paidBy: formData.paidBy,
        participants: formData.participants 
      };

      await addExpense(roomId,payload);
      
      setIsAdding(false);
      setFormData({ 
        title: '', 
        amount: '', 
        category: 'General', 
        paidBy: user?._id, 
        participants: [] 
      });
      await fetchExpenses();
      if (onRefresh) onRefresh(); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Delete this expense? This affects all balances.")) return;
    try {
      await deleteExpense(roomId,expenseId);
      await fetchExpenses();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to delete expense.");
    }
  };

  const getName = (id) => {
    const m = members.find(m => m.user?._id === id || m.user === id);
    if (m) return m.user?.name || 'Unknown';
    return 'User'; 
  };

  // --- Calculations for UI ---
  const allMemberIds = members.map(m => m.user?._id || m.user);
  const isAllSelected = formData.participants.length === allMemberIds.length && allMemberIds.length > 0;
  
  const participantCount = formData.participants.length;
  const totalAmount = Number(formData.amount) || 0;
  const perPersonShare = participantCount > 0 ? (totalAmount / participantCount).toFixed(2) : '0.00';
  const selectedNames = formData.participants.map(id => getName(id)).join(', ');

  if (loading && !expenses.length) return <div className="p-8 text-center text-gray-500">Loading expenses...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* --- Header & Add Button --- */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Expense History</h2>
          <p className="text-sm text-gray-500">View and manage group spending</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-bold text-sm"
          >
            {isAdding ? 'Cancel' : '+ Add Expense'}
          </button>
        )}
      </div>

      {/* --- Add Expense Form --- */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm animate-fade-in-down">
          <h3 className="font-bold text-gray-800 mb-4">Add New Expense</h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            {/* ... (Form Inputs same as before) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dinner at Taj"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Category</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="General">General</option>
                  <option value="Food">Food</option>
                  <option value="Stay">Stay</option>
                  <option value="Travel">Travel</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Settlement">Settlement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Paid By</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  value={formData.paidBy}
                  onChange={e => setFormData({...formData, paidBy: e.target.value})}
                >
                   {members.map(m => (
                     <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                       {m.user?.name || 'Unknown'}
                     </option>
                   ))}
                </select>
              </div>
            </div>

            {/* Participants */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Split Among</label>
                <button type="button" onClick={handleSelectAll} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                  {isAllSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-40 overflow-y-auto custom-scrollbar">
                {members.map(m => {
                   const uId = m.user?._id || m.user;
                   const uName = m.user?.name || 'Unknown';
                   const isSelected = formData.participants.includes(uId);
                   return (
                     <div key={uId} onClick={() => handleParticipantToggle(uId)} className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all select-none ${isSelected ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                       <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300'}`}>
                         {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                       </div>
                       <span className="text-sm font-medium truncate">{uName}</span>
                     </div>
                   );
                })}
              </div>
              {/* Add Summary Box Here */}
              <div className="mt-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 flex flex-col gap-1">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Participants:</span>
                    <span className="font-bold text-gray-800">{participantCount}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Per Person Share:</span>
                    <span className="font-bold text-emerald-600 text-lg">₹{perPersonShare}</span>
                 </div>
                 <div className="mt-2 pt-2 border-t border-emerald-100 text-xs text-gray-500">
                    <span className="font-bold text-gray-600">Splitting with: </span>
                    {isAllSelected ? "All Members" : selectedNames || "None"}
                 </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={submitting} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow-sm disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- Expenses List --- */}
      <div className="space-y-3">
        {expenses.length > 0 ? (
          expenses.map((expense) => {
            const payerObj = expense.paidBy || expense.payer; 
            const payerName = payerObj?.name || getName(payerObj) || getName(expense.paidBy);
            const date = new Date(expense.createdAt).toLocaleDateString();

            // --- Logic for Split Participants Display ---
            const shareCount = expense.shares ? expense.shares.length : 0;
            const isEveryone = shareCount === members.length && members.length > 0;
            
            // Generate list of names
            let splitText = "";
            if (isEveryone) {
                splitText = "All Members";
            } else if (expense.shares && expense.shares.length > 0) {
                // Map share UIDs to Names
                const names = expense.shares.map(s => getName(s.user._id));
                // if (names.length <= 2) {
                    splitText = names.join(", ");
                // } 
                // else {
                //     splitText = `${names[0]}, ${names[1]} +${names.length - 2} others`;
                // }
            } else {
                splitText = "Unknown";
            }

            return (
              <div key={expense._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    {payerName.charAt(0).toUpperCase()}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{expense.title}</h3>
                    
                    {/* Date and Category Row */}
                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-emerald-600">{payerName}</span> paid
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      {date}
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-medium text-[10px] uppercase">{expense.category}</span>
                    </p>

                    {/* NEW: Split With Row */}
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                       Split with: <span className="font-medium text-gray-600">{splitText}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900 text-lg">₹{expense.amount}</span>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(expense._id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Expense"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No expenses yet. Start spending!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PaymentsTab;