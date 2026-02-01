'use client';

import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TransactionModal from '../components/TransactionModal';
import TransactionList from '../components/TransactionList';
import SummaryCard from '../components/SummaryCard';
import AccountCard from '../components/AccountCard';

function Home() {
  const {
    summary,
    accounts,
    recentTransactions,
    fetchSummary,
    fetchAccounts,
    fetchRecentTransactions,
    deleteTransaction,
    refreshAllData,
    loading,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchSummary({ period: 'monthly' }),
          fetchAccounts(),
          fetchRecentTransactions({ limit: 5 }),
        ]);
      } catch (error) {
        console.error('Error loading home data:', error);
      }
    };
    loadData();
  }, [fetchSummary, fetchAccounts, fetchRecentTransactions]);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        await refreshAllData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-1">Here is your financial overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Income"
          amount={summary.totalIncome}
          type="income"
          icon={TrendingUp}
        />
        <SummaryCard
          title="Total Expense"
          amount={summary.totalExpense}
          type="expense"
          icon={TrendingDown}
        />
        <SummaryCard
          title="Balance"
          amount={summary.balance}
          type="balance"
          icon={Wallet}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <AccountCard key={account._id} account={account} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
        </div>
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : (
          <TransactionList
            transactions={recentTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editTransaction={editingTransaction}
      />
    </div>
  );
}

export default Home;
