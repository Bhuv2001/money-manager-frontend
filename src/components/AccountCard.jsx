import React from 'react';
import { Banknote, CreditCard, Wallet } from 'lucide-react';

function AccountCard({ account }) {
  const getAccountIcon = (name) => {
    switch (name) {
      case 'cash':
        return Banknote;
      case 'bank':
        return CreditCard;
      case 'wallet':
        return Wallet;
      default:
        return Wallet;
    }
  };

  const getAccountColors = (name) => {
    switch (name) {
      case 'cash':
        return {
          bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
          iconBg: 'bg-emerald-300/30',
        };
      case 'bank':
        return {
          bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
          iconBg: 'bg-blue-300/30',
        };
      case 'wallet':
        return {
          bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
          iconBg: 'bg-purple-300/30',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-400 to-slate-600',
          iconBg: 'bg-slate-300/30',
        };
    }
  };

  const Icon = getAccountIcon(account.name);
  const colors = getAccountColors(account.name);

  return (
    <div className={`${colors.bg} rounded-2xl p-6 text-white`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-white/80 text-sm font-medium capitalize">{account.name} Account</span>
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">Balance</p>
        <p className="text-3xl font-bold">${account.balance.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default AccountCard;
