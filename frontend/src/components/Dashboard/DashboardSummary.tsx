import React from 'react';
import { FaChartLine, FaExchangeAlt, FaCoins, FaWallet } from 'react-icons/fa';

interface DashboardSummaryProps {
  totalWalletValue: number;
  dailyChangePercentage: number;
  totalTransactions: number;
  activeTokens: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalWalletValue,
  dailyChangePercentage,
  totalTransactions,
  activeTokens,
}) => {
  const isPositiveChange = dailyChangePercentage >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Portfolio Value</p>
            <h3 className="text-2xl font-bold">${totalWalletValue.toLocaleString()}</h3>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <FaWallet className="text-blue-600 dark:text-blue-300 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">24h Change</p>
            <h3 className={`text-2xl font-bold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveChange ? '+' : ''}{dailyChangePercentage.toFixed(2)}%
            </h3>
          </div>
          <div className={`${isPositiveChange ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} p-3 rounded-full`}>
            <FaChartLine className={`${isPositiveChange ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'} text-xl`} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Transactions</p>
            <h3 className="text-2xl font-bold">{totalTransactions.toLocaleString()}</h3>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <FaExchangeAlt className="text-purple-600 dark:text-purple-300 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Active Tokens</p>
            <h3 className="text-2xl font-bold">{activeTokens}</h3>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
            <FaCoins className="text-yellow-600 dark:text-yellow-300 text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary; 