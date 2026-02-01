import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

function SummaryCard({ title, amount, type, icon: CustomIcon }) {
  const getStyles = () => {
    switch (type) {
      case 'income':
        return {
          bg: 'bg-emerald-50',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          amountColor: 'text-emerald-600',
          Icon: CustomIcon || TrendingUp,
        };
      case 'expense':
        return {
          bg: 'bg-red-50',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          amountColor: 'text-red-600',
          Icon: CustomIcon || TrendingDown,
        };
      case 'balance':
        return {
          bg: 'bg-indigo-50',
          iconBg: 'bg-indigo-100',
          iconColor: 'text-indigo-600',
          amountColor: 'text-indigo-600',
          Icon: CustomIcon || Wallet,
        };
      default:
        return {
          bg: 'bg-slate-50',
          iconBg: 'bg-slate-100',
          iconColor: 'text-slate-600',
          amountColor: 'text-slate-600',
          Icon: CustomIcon || Wallet,
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.Icon;

  return (
    <div className={`${styles.bg} rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <div className={`w-10 h-10 ${styles.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${styles.amountColor}`}>
        ${amount.toLocaleString()}
      </p>
    </div>
  );
}

export default SummaryCard;
