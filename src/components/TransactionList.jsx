'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ArrowRightLeft,
  Edit2,
  Trash2,
  Clock
} from 'lucide-react';

function TransactionList({ transactions, onEdit, onDelete, showActions = true }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No transactions found
      </div>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="w-5 h-5 text-emerald-500" />;
      case 'expense':
        return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
      case 'transfer':
        return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getAmountColor = (type) => {
    switch (type) {
      case 'income':
        return 'text-emerald-600';
      case 'expense':
        return 'text-red-600';
      case 'transfer':
        return 'text-blue-600';
      default:
        return 'text-slate-600';
    }
  };

  const getAmountPrefix = (type) => {
    switch (type) {
      case 'income':
        return '+';
      case 'expense':
        return '-';
      default:
        return '';
    }
  };

  return (
    <div className="divide-y divide-slate-100">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="flex items-center justify-between py-4 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              {getTypeIcon(transaction.type)}
            </div>
            <div>
              <p className="font-medium text-slate-800">{transaction.description}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-slate-500">{transaction.category}</span>
                {transaction.division && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span className="text-sm text-slate-500 capitalize">{transaction.division}</span>
                  </>
                )}
                <span className="text-slate-300">|</span>
                <span className="text-sm text-slate-500 capitalize">{transaction.account}</span>
                {transaction.toAccount && (
                  <>
                    <span className="text-slate-400">→</span>
                    <span className="text-sm text-slate-500 capitalize">{transaction.toAccount}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
                {getAmountPrefix(transaction.type)}${transaction.amount.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {format(new Date(transaction.date), 'MMM d, yyyy h:mm a')}
              </p>
            </div>

            {showActions && (
              <div className="flex items-center gap-1">
                {transaction.isEditable ? (
                  <>
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Edit transaction"
                    >
                      <Edit2 className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction._id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-slate-400 px-2">
                    <Clock className="w-3 h-3" />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;
