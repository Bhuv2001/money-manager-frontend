import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const transactionAPI = {
  create: (data) => api.post("/transactions", data),
  getAll: (params) => api.get("/transactions", { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export const dashboardAPI = {
  getSummary: (params) => api.get("/dashboard/summary", { params }),
  getChartData: (params) => api.get("/dashboard/chart", { params }),
  getCategorySummary: (params) => api.get("/dashboard/category-summary", { params }),
  getRecentTransactions: (params) => api.get("/dashboard/recent", { params }),
};

export const accountAPI = {
  getAll: () => api.get("/accounts"),
  getByName: (name) => api.get(`/accounts/${name}`),
};

export const categoryAPI = {
  getAll: (type) => api.get("/categories", { params: { type } }),
};

export default api;
