'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import FilterBar from '../components/FilterBar';

function Transactions() {
  const {
    transactions,
    fetchTransactions,
    deleteTransaction,
    loading,
  } = useApp();

  const [filters, setFilters] = useState({
    period: 'monthly',
    division: '',
    category: '',
    startDate: '',
    endDate: '',
    type: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const loadTransactions = useCallback(async () => {
    try {
      const params = {
        page: currentPage,
        limit: 20,
        ...(filters.division && { division: filters.division }),
        ...(filters.category && { category: filters.category }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.type && { type: filters.type }),
      };

      const response = await fetchTransactions(params);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, [filters, currentPage, fetchTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        await loadTransactions();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    await loadTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
          <p className="text-slate-500 mt-1">View and manage all your transactions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        showPeriod={false}
      />

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFilterChange({ type: '' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !filters.type
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange({ type: 'income' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.type === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => handleFilterChange({ type: 'expense' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => handleFilterChange({ type: 'transfer' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.type === 'transfer'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Transfer
            </button>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading transactions...</div>
          ) : (
            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        {pagination.pages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing page {currentPage} of {pagination.pages} ({pagination.total} total)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={currentPage === pagination.pages}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editTransaction={editingTransaction}
      />
    </div>
  );
}

export default Transactions;
