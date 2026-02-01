'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FilterBar from '../components/FilterBar';

function Summary() {
  const { categorySummary, fetchCategorySummary, loading } = useApp();

  const [filters, setFilters] = useState({
    period: 'monthly',
    division: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  const loadCategorySummary = useCallback(async () => {
    try {
      const params = {
        period: filters.period,
        ...(filters.division && { division: filters.division }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      await fetchCategorySummary(params);
    } catch (error) {
      console.error('Error loading category summary:', error);
    }
  }, [filters, fetchCategorySummary]);

  useEffect(() => {
    loadCategorySummary();
  }, [loadCategorySummary]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const incomeCategories = categorySummary.filter(item => item.type === 'income');
  const expenseCategories = categorySummary.filter(item => item.type === 'expense');

  const totalIncome = incomeCategories.reduce((sum, item) => sum + item.total, 0);
  const totalExpense = expenseCategories.reduce((sum, item) => sum + item.total, 0);

  const getMaxAmount = (items) => {
    if (items.length === 0) return 1;
    return Math.max(...items.map(item => item.total));
  };

  const incomeMax = getMaxAmount(incomeCategories);
  const expenseMax = getMaxAmount(expenseCategories);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Category Summary</h1>
        <p className="text-slate-500 mt-1">View your income and expenses by category</p>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        showPeriod={true}
      />

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading summary...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Income by Category</h2>
                  <p className="text-sm text-slate-500">Total: ${totalIncome.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {incomeCategories.length === 0 ? (
              <p className="text-center py-8 text-slate-500">No income data available</p>
            ) : (
              <div className="space-y-4">
                {incomeCategories.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{item.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{item.count} transactions</span>
                        <span className="text-sm font-semibold text-emerald-600">
                          +${item.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${(item.total / incomeMax) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Expenses by Category</h2>
                  <p className="text-sm text-slate-500">Total: ${totalExpense.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {expenseCategories.length === 0 ? (
              <p className="text-center py-8 text-slate-500">No expense data available</p>
            ) : (
              <div className="space-y-4">
                {expenseCategories.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{item.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{item.count} transactions</span>
                        <span className="text-sm font-semibold text-red-600">
                          -${item.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${(item.total / expenseMax) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Summary Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-emerald-600">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">${totalExpense.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-1">Net Savings</p>
            <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              ${(totalIncome - totalExpense).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
