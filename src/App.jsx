import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Summary from './pages/Summary';
import Accounts from './pages/Accounts';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/accounts" element={<Accounts />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
