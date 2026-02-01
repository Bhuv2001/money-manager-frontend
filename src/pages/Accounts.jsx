'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AccountCard from '../components/AccountCard';
import TransactionModal from '../components/TransactionModal';

function Accounts() {
  const {
    accounts,
    fetchAccounts,
    createTransaction,
    refreshAllData,
    loading,
  } = useApp();

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transferData, setTransferData] = useState({
    fromAccount: 'bank',
    toAccount: 'wallet',
    amount: '',
    description: '',
  });
  const [transferError, setTransferError] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferData(prev => ({ ...prev, [name]: value }));
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setTransferError('');

    if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
      setTransferError('Please enter a valid amount');
      return;
    }

    if (transferData.fromAccount === transferData.toAccount) {
      setTransferError('Source and destination accounts must be different');
      return;
    }

    const sourceAccount = accounts.find(acc => acc.name === transferData.fromAccount);
    if (sourceAccount && sourceAccount.balance < parseFloat(transferData.amount)) {
      setTransferError('Insufficient balance in source account');
      return;
    }

    try {
      setTransferLoading(true);
      await createTransaction({
        type: 'transfer',
        amount: parseFloat(transferData.amount),
        description: transferData.description || `Transfer from ${transferData.fromAccount} to ${transferData.toAccount}`,
        account: transferData.fromAccount,
        toAccount: transferData.toAccount,
        date: new Date().toISOString(),
      });

      await refreshAllData();
      setIsTransferModalOpen(false);
      setTransferData({
        fromAccount: 'bank',
        toAccount: 'wallet',
        amount: '',
        description: '',
      });
    } catch (error) {
      setTransferError(error.response?.data?.message || 'Failed to complete transfer');
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Accounts</h1>
          <p className="text-slate-500 mt-1">Manage your accounts and transfers</p>
        </div>
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <ArrowRightLeft className="w-5 h-5" />
          Transfer
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-sm">Total Balance</p>
            <p className="text-3xl font-bold">${totalBalance.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-white/60 text-sm">Across all accounts</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading accounts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <AccountCard key={account._id} account={account} />
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Account Information</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Account</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Balance</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account._id} className="border-b border-slate-100">
                  <td className="py-4 px-4">
                    <span className="font-medium text-slate-800 capitalize">{account.name}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-slate-800">${account.balance.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-slate-600">
                      {totalBalance > 0 ? ((account.balance / totalBalance) * 100).toFixed(1) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Transfer Between Accounts</h2>
            </div>

            <form onSubmit={handleTransferSubmit} className="p-6 space-y-4">
              {transferError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {transferError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  From Account
                </label>
                <select
                  name="fromAccount"
                  value={transferData.fromAccount}
                  onChange={handleTransferChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {accounts.map(acc => (
                    <option key={acc._id} value={acc.name} className="capitalize">
                      {acc.name.charAt(0).toUpperCase() + acc.name.slice(1)} (${acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  To Account
                </label>
                <select
                  name="toAccount"
                  value={transferData.toAccount}
                  onChange={handleTransferChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {accounts
                    .filter(acc => acc.name !== transferData.fromAccount)
                    .map(acc => (
                      <option key={acc._id} value={acc.name} className="capitalize">
                        {acc.name.charAt(0).toUpperCase() + acc.name.slice(1)} (${acc.balance.toLocaleString()})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={transferData.amount}
                  onChange={handleTransferChange}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description (optional)
                </label>
                <input
                  type="text"
                  name="description"
                  value={transferData.description}
                  onChange={handleTransferChange}
                  placeholder="Enter description"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {transferLoading ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

export default Accounts;
