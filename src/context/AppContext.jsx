'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';

import {
  transactionAPI,
  dashboardAPI,
  accountAPI,
  categoryAPI,
} from '../services/api';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // ✅ SAFE INITIAL STATES
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    period: 'monthly',
    division: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  // 🔹 Helper to safely read backend response
  const getData = (res) => res?.data?.data ?? [];

  // ================= TRANSACTIONS =================

  const fetchTransactions = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        const res = await transactionAPI.getAll({ ...filters, ...params });
        setTransactions(getData(res));
        return res.data;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transactions');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const createTransaction = useCallback(async (data) => {
    try {
      setLoading(true);
      const res = await transactionAPI.create(data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const res = await transactionAPI.update(id, data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await transactionAPI.delete(id);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= ACCOUNTS =================

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await accountAPI.getAll();
      setAccounts(getData(res));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch accounts');
      throw err;
    }
  }, []);

  // ================= CATEGORIES =================

  const fetchCategories = useCallback(async (type) => {
    try {
      const res = await categoryAPI.getAll(type);
      setCategories(getData(res));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      throw err;
    }
  }, []);

  // ================= DASHBOARD =================

  const fetchSummary = useCallback(
    async (params = {}) => {
      try {
        const res = await dashboardAPI.getSummary({ ...filters, ...params });
        setSummary(
          res?.data?.data ?? {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
          }
        );
        return res.data;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch summary');
        throw err;
      }
    },
    [filters]
  );

  const fetchChartData = useCallback(
    async (params = {}) => {
      try {
        const res = await dashboardAPI.getChartData({ ...filters, ...params });
        setChartData(getData(res));
        return res.data;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch chart data');
        throw err;
      }
    },
    [filters]
  );

  const fetchCategorySummary = useCallback(
    async (params = {}) => {
      try {
        const res = await dashboardAPI.getCategorySummary({
          ...filters,
          ...params,
        });
        setCategorySummary(getData(res));
        return res.data;
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch category summary'
        );
        throw err;
      }
    },
    [filters]
  );

  const fetchRecentTransactions = useCallback(
    async (params = {}) => {
      try {
        const res = await dashboardAPI.getRecentTransactions({
          ...filters,
          ...params,
        });
        setRecentTransactions(getData(res));
        return res.data;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to fetch recent transactions'
        );
        throw err;
      }
    },
    [filters]
  );

  // ================= REFRESH =================

  const refreshAllData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchSummary(),
        fetchChartData(),
        fetchCategorySummary(),
        fetchRecentTransactions(),
        fetchAccounts(),
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  }, [
    fetchSummary,
    fetchChartData,
    fetchCategorySummary,
    fetchRecentTransactions,
    fetchAccounts,
  ]);

  // ================= UTILS =================

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ================= CONTEXT VALUE =================

  const value = {
    transactions,
    accounts,
    categories,
    summary,
    chartData,
    categorySummary,
    recentTransactions,
    loading,
    error,
    filters,
    fetchTransactions,
    fetchAccounts,
    fetchCategories,
    fetchSummary,
    fetchChartData,
    fetchCategorySummary,
    fetchRecentTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshAllData,
    updateFilters,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
