"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar,
  DollarSign,
  CreditCard,
  Coffee,
  Car,
  Home,
  ShoppingBag,
  Utensils,
  Gamepad2,
  Search,
  Filter,
  Edit,
  Trash2
} from 'lucide-react';

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const transactions = [
    {
      id: 1,
      title: "Grocery Shopping",
      category: "Food & Dining",
      amount: -2500.50,
      date: "2025-07-03",
      time: "14:32",
      icon: ShoppingBag,
      color: "bg-green-500"
    },
    {
      id: 2,
      title: "Salary Deposit",
      category: "Income",
      amount: 85000.00,
      date: "2025-07-01",
      time: "09:00",
      icon: DollarSign,
      color: "bg-blue-500"
    },
    {
      id: 3,
      title: "Coffee Shop",
      category: "Food & Dining",
      amount: -180.75,
      date: "2025-07-02",
      time: "08:15",
      icon: Coffee,
      color: "bg-orange-500"
    },
    {
      id: 4,
      title: "Gas Station",
      category: "Transportation",
      amount: -1200.20,
      date: "2025-07-01",
      time: "17:45",
      icon: Car,
      color: "bg-red-500"
    },
    {
      id: 5,
      title: "Netflix Subscription",
      category: "Entertainment",
      amount: -649.99,
      date: "2025-06-30",
      time: "12:00",
      icon: Gamepad2,
      color: "bg-purple-500"
    },
    {
      id: 6,
      title: "Restaurant Dinner",
      category: "Food & Dining",
      amount: -1850.40,
      date: "2025-06-29",
      time: "19:30",
      icon: Utensils,
      color: "bg-pink-500"
    },
    {
      id: 7,
      title: "Freelance Payment",
      category: "Income",
      amount: 25000.00,
      date: "2025-06-28",
      time: "11:20",
      icon: CreditCard,
      color: "bg-indigo-500"
    },
    {
      id: 8,
      title: "Electricity Bill",
      category: "Utilities",
      amount: -3250.30,
      date: "2025-06-27",
      time: "16:15",
      icon: Home,
      color: "bg-yellow-500"
    }
  ];

  const handleAddTransaction = () => {
    if (isClient) {
      window.location.href = '/addTransaction';
    }
  };

  const handleLastMonth = () => {
    if (isClient) {
      window.location.href = '/lastMonth';
    }
  };

  const handleEditTransaction = (id) => {
    console.log('Edit transaction:', id);
  };

  const handleDeleteTransaction = (id) => {
    console.log('Delete transaction:', id);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-green-400">Financial Visualizer</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <Button
                onClick={handleLastMonth}
                variant="outline"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-green-400 transition-all duration-300 w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Last Month Spent</span>
                <span className="sm:hidden">Last Month</span>
              </Button>
              <Button
                onClick={handleAddTransaction}
                className="bg-green-500 hover:bg-green-600 text-white font-medium transition-all duration-300 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">All Transactions</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 w-full sm:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            const IconComponent = transaction.icon;
            return (
              <Card key={transaction.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${transaction.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-base sm:text-lg truncate">{transaction.title}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm truncate">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                      <div className="text-left sm:text-right">
                        <div className={`font-bold text-base sm:text-lg ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.amount > 0 ? '+' : '-'}{formatAmount(transaction.amount)}
                        </div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {formatDate(transaction.date)} • {transaction.time}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Button
                          onClick={() => handleEditTransaction(transaction.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 p-1.5 sm:p-2 transition-all duration-300"
                        >
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-1.5 sm:p-2 transition-all duration-300"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No transactions found</h3>
            <p className="text-gray-400">Try adjusting your search terms or add your first transaction.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;