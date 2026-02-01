'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import Chart from '../components/Chart';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import FilterBar from '../components/FilterBar';

function Dashboard() {
  const {
    summary,
    chartData,
    recentTransactions,
    fetchSummary,
    fetchChartData,
    fetchRecentTransactions,
    deleteTransaction,
    refreshAllData,
    loading,
  } = useApp();

  const [filters, setFilters] = useState({
    period: 'monthly',
    division: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const loadDashboardData = useCallback(async () => {
    try {
      const params = {
        period: filters.period,
        ...(filters.division && { division: filters.division }),
        ...(filters.category && { category: filters.category }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      await Promise.all([
        fetchSummary(params),
        fetchChartData(params),
        fetchRecentTransactions({ ...params, limit: 10 }),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, [filters, fetchSummary, fetchChartData, fetchRecentTransactions]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        await loadDashboardData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    await loadDashboardData();
  };

  const getPeriodLabel = () => {
    switch (filters.period) {
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      case 'yearly':
        return 'This Year';
      default:
        return 'This Month';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Track your income and expenses</p>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        showPeriod={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title={`Income (${getPeriodLabel()})`}
          amount={summary.totalIncome}
          type="income"
          icon={TrendingUp}
        />
        <SummaryCard
          title={`Expenses (${getPeriodLabel()})`}
          amount={summary.totalExpense}
          type="expense"
          icon={TrendingDown}
        />
        <SummaryCard
          title="Net Balance"
          amount={summary.balance}
          type="balance"
          icon={Wallet}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Income vs Expenses ({getPeriodLabel()})
        </h2>
        {loading ? (
          <div className="h-80 flex items-center justify-center text-slate-500">
            Loading chart...
          </div>
        ) : (
          <Chart data={chartData} period={filters.period} />
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Transactions
        </h2>
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

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editTransaction={editingTransaction}
      />
    </div>
  );
}

export default Dashboard;
