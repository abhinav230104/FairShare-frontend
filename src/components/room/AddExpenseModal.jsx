import React, { useState, useEffect } from 'react';

const AddExpenseModal = ({ isOpen, onClose, onSubmit, members }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setAmount('');
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    
    onSubmit({
      title,
      amount: parseFloat(amount)
    });
    handleClose();
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${!isOpen ? 'pointer-events-none' : ''}`}>
      
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`bg-white w-full max-w-lg rounded-2xl shadow-2xl relative transform transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Add an Expense</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-xl">🛒</span>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grocery Run" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400 font-bold">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" 
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg font-bold text-gray-900" 
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
             <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Paid by</p>
             <div className="flex gap-2">
               <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-200">You</span>
               <span className="text-gray-400 text-sm py-1">and split equally.</span>
             </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5">
            Save Expense
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddExpenseModal;