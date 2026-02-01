'use client';

import React from 'react';
import { Filter, X } from 'lucide-react';

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Bonus', 'Other Income'];
const expenseCategories = ['Food', 'Fuel', 'Movie', 'Medical', 'Loan', 'Shopping', 'Bills', 'Rent', 'Travel', 'Entertainment', 'Education', 'Utilities', 'Insurance', 'Maintenance', 'Other Expense'];
const allCategories = [...new Set([...incomeCategories, ...expenseCategories])];

function FilterBar({ filters, onFilterChange, showPeriod = true }) {
  const hasActiveFilters = filters.division || filters.category || filters.startDate || filters.endDate;

  const clearFilters = () => {
    onFilterChange({
      division: '',
      category: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500" />
          <span className="font-medium text-slate-700">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {showPeriod && (
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Period</label>
            <select
              value={filters.period}
              onChange={(e) => onFilterChange({ period: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Division</label>
          <select
            value={filters.division}
            onChange={(e) => onFilterChange({ division: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Divisions</option>
            <option value="personal">Personal</option>
            <option value="office">Office</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
