"use client"
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
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
          transaction.type === 'expense' && 
          transaction.amount > 0 
        );
      processMonthlyData(validTransactions);
      
    } catch (error) {
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
      spent: 0
    }));
    
    transactions.forEach(transaction => {
      const month = transaction.date.getMonth();
      const amount = transaction.amount; 
      monthlySpending[month].spent += amount;
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
          <p className="text-white font-medium">{label}</p>
          <p className="text-green-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen bg-gray-900 p-8">
      <div className="w-full h-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
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
              <Bar 
                dataKey="spent" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlySpendingChart;