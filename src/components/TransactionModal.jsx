'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Bonus', 'Other Income'];
const expenseCategories = ['Food', 'Fuel', 'Movie', 'Medical', 'Loan', 'Shopping', 'Bills', 'Rent', 'Travel', 'Entertainment', 'Education', 'Utilities', 'Insurance', 'Maintenance', 'Other Expense'];
const divisions = ['personal', 'office'];
const accountOptions = ['cash', 'bank', 'wallet'];

function TransactionModal({ isOpen, onClose, editTransaction = null }) {
  const { createTransaction, updateTransaction, refreshAllData } = useApp();
  const [activeTab, setActiveTab] = useState('expense');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    division: 'personal',
    account: 'cash',
    toAccount: 'bank',
    date: new Date().toISOString().slice(0, 16),
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editTransaction) {
      setActiveTab(editTransaction.type);
      setFormData({
        amount: editTransaction.amount.toString(),
        description: editTransaction.description,
        category: editTransaction.category,
        division: editTransaction.division || 'personal',
        account: editTransaction.account,
        toAccount: editTransaction.toAccount || 'bank',
        date: new Date(editTransaction.date).toISOString().slice(0, 16),
      });
    } else {
      resetForm();
    }
  }, [editTransaction, isOpen]);

  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      category: '',
      division: 'personal',
      account: 'cash',
      toAccount: 'bank',
      date: new Date().toISOString().slice(0, 16),
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (activeTab !== 'transfer' && !formData.category) {
      setError('Please select a category');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (activeTab === 'transfer' && formData.account === formData.toAccount) {
      setError('Source and destination accounts must be different');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        type: activeTab,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category: activeTab === 'transfer' ? 'Transfer' : formData.category,
        account: formData.account,
        date: new Date(formData.date).toISOString(),
      };

      if (activeTab !== 'transfer') {
        payload.division = formData.division;
      } else {
        payload.toAccount = formData.toAccount;
      }

      if (editTransaction) {
        await updateTransaction(editTransaction._id, payload);
      } else {
        await createTransaction(payload);
      }

      await refreshAllData();
      onClose();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const categories = activeTab === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('income')}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('expense')}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'transfer'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              Transfer
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                maxLength={100}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {activeTab !== 'transfer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Division
                  </label>
                  <div className="flex gap-3">
                    {divisions.map(div => (
                      <label
                        key={div}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-colors ${
                          formData.division === div
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="division"
                          value={div}
                          checked={formData.division === div}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="capitalize text-sm font-medium">{div}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {activeTab === 'transfer' ? 'From Account' : 'Account'}
              </label>
              <select
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {accountOptions.map(acc => (
                  <option key={acc} value={acc} className="capitalize">{acc.charAt(0).toUpperCase() + acc.slice(1)}</option>
                ))}
              </select>
            </div>

            {activeTab === 'transfer' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  To Account
                </label>
                <select
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  {accountOptions.filter(acc => acc !== formData.account).map(acc => (
                    <option key={acc} value={acc} className="capitalize">{acc.charAt(0).toUpperCase() + acc.slice(1)}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
                activeTab === 'income'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : activeTab === 'expense'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? 'Saving...' : editTransaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
