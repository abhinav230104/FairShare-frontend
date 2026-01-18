import React from 'react';

const ExpensesList = ({ expenses, currentUser, currency = '₹' }) => {
  
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
        <p className="text-gray-400">No expenses yet. Add the first one!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <ul className="divide-y divide-gray-50">
        {expenses.map((expense) => {
          const isPayer = expense.payer === currentUser;
          
          return (
            <li key={expense.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center group cursor-pointer">
              
              <div className="flex items-center gap-4">
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-gray-500 text-xs font-bold">
                  <span>{expense.date.split('-')[2]}</span>
                  <span className="uppercase text-[10px]">{new Date(expense.date).toLocaleString('default', { month: 'short' })}</span>
                </div>

                {/* Details */}
                <div>
                  <p className="font-bold text-gray-900 capitalize">{expense.title}</p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{isPayer ? 'You' : expense.payer}</span> paid {currency}{expense.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Amount Status */}
              <div className="text-right">
                <p className={`font-bold text-sm ${isPayer ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isPayer ? 'You lent' : 'You borrowed'}
                </p>
                <p className={`text-sm font-bold ${isPayer ? 'text-emerald-600' : 'text-red-500'}`}>
                   {/* Visual mock of split amount (assuming 4 people) */}
                   {currency}{(expense.amount / 4 * 3).toFixed(0)} 
                </p>
              </div>

            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpensesList;