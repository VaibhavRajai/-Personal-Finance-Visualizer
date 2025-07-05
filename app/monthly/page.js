"use client"
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const MonthlySpendingChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchTransactions();
  }, [currentYear]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://finance-visualizer-backend.vercel.app/api/getTransactions');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      let transactionsArray = [];
      if (Array.isArray(data)) {
        transactionsArray = data;
      } else if (data && Array.isArray(data.data)) {
        transactionsArray = data.data;
      } else if (data && data.data && !Array.isArray(data.data)) {
        transactionsArray = [data.data];
      } else {
        processMonthlyData([]);
        return;
      }
      const validTransactions = transactionsArray
        .filter(transaction => transaction && transaction.date)
        .map(transaction => ({
          ...transaction,
          amount: parseFloat(transaction.amount) || 0,
          date: new Date(transaction.date)
        }))
        .filter(transaction => 
          transaction.date.getFullYear() === currentYear &&
          (transaction.type === 'expense' || transaction.type === 'income') && 
          transaction.amount > 0 
        );
      processMonthlyData(validTransactions);
      
    } catch (error)  {
      console.error('Error fetching transactions:', error);
      setMonthlyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const processMonthlyData = (transactions) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const monthlySpending = months.map((month, index) => ({
      month,
      expense: 0,
      income: 0
    }));
    
    transactions.forEach(transaction => {
      const month = transaction.date.getMonth();
      const amount = transaction.amount; 
      
      if (transaction.type === 'expense') {
        monthlySpending[month].expense += amount;
      } else if (transaction.type === 'income') {
        monthlySpending[month].income += amount;
      }
    });
    setMonthlyData(monthlySpending);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.dataKey === 'expense' ? 'Expense' : 'Income'}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen bg-gray-900 p-8">
      <div className="w-full h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Monthly Profit vs Expenses</h2>
          <p className="text-gray-400">Year: {currentYear}</p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-5/6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={14}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={14}
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#9CA3AF' }}
                  iconType="rect"
                />
                <Bar 
                  dataKey="income" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  name="Income"
                />
                <Bar 
                  dataKey="expense" 
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  name="Expense"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlySpendingChart;