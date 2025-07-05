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
  Trash2,
  X,
  Save,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
const TransactionsPage = () => {
  const router=useRouter()
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editModal, setEditModal] = useState({ isOpen: false, transaction: null });
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    amount: '',
    date: '',
    time: '',
    type: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [error, setError] = useState(null);
  
  const getIconForCategory = (category) => {
    if (!category) return CreditCard;
    
    const iconMap = {
      "Food & Dining": ShoppingBag,
      "Income": DollarSign,
      "Transportation": Car,
      "Entertainment": Gamepad2,
      "Utilities": Home,
      "Shopping": ShoppingBag,
      "Healthcare": Home,
      "Education": Home,
      "Travel": Car,
      "Other": CreditCard
    };
    return iconMap[category] || CreditCard;
  };

  const getColorForCategory = (category) => {
    if (!category) return "bg-gray-500";
    
    const colorMap = {
      "Food & Dining": "bg-green-500",
      "Income": "bg-blue-500",
      "Transportation": "bg-red-500",
      "Entertainment": "bg-purple-500",
      "Utilities": "bg-yellow-500",
      "Shopping": "bg-pink-500",
      "Healthcare": "bg-indigo-500",
      "Education": "bg-cyan-500",
      "Travel": "bg-orange-500",
      "Other": "bg-gray-500"
    };
    return colorMap[category] || "bg-gray-500";
  };
  const getIconForTransaction = (transaction) => {
    if (transaction.type === 'income') {
      return ArrowUpCircle;
    } else {
      return ArrowDownCircle;
    }
  };
  const getColorForTransaction = (transaction) => {
    if (transaction.type === 'income') {
      return "bg-green-500";
    } else {
      return "bg-red-500";
    }
  };

  const categories = [
    "Food & Dining",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Income",
    "Shopping",
    "Healthcare",
    "Education",
    "Travel",
    "Other"
  ];

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      setError(null);
      
      const response = await fetch('https://finance-visualizer-backend.vercel.app/api/getTransactions');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data); 
      let transactionsArray = [];
      if (Array.isArray(data)) {
        transactionsArray = data;
      } else if (data && Array.isArray(data.transactions)) {
        transactionsArray = data.transactions;
      } else if (data && Array.isArray(data.data)) {
        transactionsArray = data.data;
      } else if (data && data.message) {
        console.log('API Message:', data.message);
        setTransactions([]);
        return;
      } else {
        console.error('Unexpected data format:', data);
        throw new Error('Unexpected data format from API');
      }
      const processedTransactions = transactionsArray
        .filter(transaction => transaction && typeof transaction === 'object')
        .map(transaction => {
          const processedTransaction = {
            id: transaction.id || Math.random().toString(36).substr(2, 9),
            title: transaction.title || transaction.description || 'Untitled Transaction',
            category: transaction.cateogry || 'Other',
            amount: parseFloat(transaction.amount) || 0,
            date: transaction.date || new Date().toISOString().split('T')[0],
            time: transaction.time || '00:00',
            type: transaction.type || (transaction.amount > 0 ? 'income' : 'expense'),
            ...transaction
          };
          
          return {
            ...processedTransaction,
            icon: getIconForTransaction(processedTransaction),
            color: getColorForTransaction(processedTransaction)
          };
        });
      
      console.log('Processed transactions:', processedTransactions);
      setTransactions(processedTransactions);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.message);
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTransactions();
  }, []);
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  const handleAddTransaction = () => {
    if (!mounted) return;
    router.push('/addTransaction');
    console.log('Navigate to add transaction page');
  };

  const handleLastMonth = () => {
    if (!mounted) return;
    router.push('/monthly');
    console.log('Navigate to monthly page');
  };

  const handleEditTransaction = (transaction) => {
    if (!mounted) return;
    setEditForm({
      title: transaction.title || '',
      category: transaction.category || '',
      amount: Math.abs(transaction.amount || 0).toString(),
      date: transaction.date || '',
      time: transaction.time || '',
      type: transaction.type || (transaction.amount > 0 ? 'income' : 'expense')
    });
    setEditModal({ isOpen: true, transaction });
  };

  const handleCloseModal = () => {
    if (!mounted) return;
    setEditModal({ isOpen: false, transaction: null });
    setEditForm({
      title: '',
      category: '',
      amount: '',
      date: '',
      time: '',
      type: ''
    });
  };

  const handleFormChange = (field, value) => {
    if (!mounted) return;
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateTransaction = async () => {
    if (!mounted || !editModal.transaction) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://finance-visualizer-backend.vercel.app/api/editTransaction', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editModal.transaction.id,
          title: editForm.title,
          category: editForm.category,
          amount: parseFloat(editForm.amount),
          date: editForm.date,
          time: editForm.time,
          type: editForm.type
        })
      });

      if (response.ok) {
        console.log('Transaction updated successfully');
        handleCloseModal();
        await fetchTransactions();
      } else {
        console.error('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!mounted) return;
    
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setIsLoading(true);
      try {
        const response = await fetch('https://finance-visualizer-backend.vercel.app/api/deleteTransaction', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        });

        if (response.ok) {
          console.log('Transaction deleted successfully');
          await fetchTransactions();
        } else {
          console.error('Failed to delete transaction');
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (!transaction) return false;
    
    const title = (transaction.title || '').toLowerCase();
    const category = (transaction.category || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return title.includes(searchLower) || category.includes(searchLower);
  });

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(Math.abs(amount || 0));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getAmountDisplay = (transaction) => {
    const amount = Math.abs(transaction.amount || 0);
    const formattedAmount = formatAmount(amount);
    
    if (transaction.type === 'income') {
      return {
        sign: '+',
        color: 'text-green-400',
        amount: formattedAmount
      };
    } else {
      return {
        sign: '-',
        color: 'text-red-400',
        amount: formattedAmount
      };
    }
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
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-red-400 font-medium">Error loading transactions</span>
            </div>
            <p className="text-red-300 text-sm mt-2">{error}</p>
            <Button
              onClick={fetchTransactions}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Try Again
            </Button>
          </div>
        )}
        
        {!isLoadingTransactions && !error && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
            <p className="text-blue-300 text-sm">
              Loaded {transactions.length} transactions. Showing {filteredTransactions.length} after filtering.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-white">Loading transactions...</span>
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const IconComponent = transaction.icon;
              const amountDisplay = getAmountDisplay(transaction);
              
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
                          <div className="flex items-center space-x-2">
                            <p className="text-gray-400 text-xs sm:text-sm truncate">{transaction.category}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'income' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {transaction.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                        <div className="text-left sm:text-right">
                          <div className={`font-bold text-base sm:text-lg ${amountDisplay.color}`}>
                            {amountDisplay.sign}{amountDisplay.amount}
                          </div>
                          <div className="text-gray-400 text-xs sm:text-sm">
                            {formatDate(transaction.date)} • {transaction.time}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Button
                            onClick={() => handleEditTransaction(transaction)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 p-1.5 sm:p-2 transition-all duration-300"
                            disabled={isLoading}
                          >
                            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-1.5 sm:p-2 transition-all duration-300"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {!isLoadingTransactions && !error && filteredTransactions.length === 0 && transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No transactions yet</h3>
            <p className="text-gray-400 mb-4">Start by adding your first transaction to track your finances.</p>
            <Button
              onClick={handleAddTransaction}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Transaction
            </Button>
          </div>
        )}

        {!isLoadingTransactions && !error && filteredTransactions.length === 0 && transactions.length > 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No transactions found</h3>
            <p className="text-gray-400">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
      
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Edit Transaction</h2>
              <Button
                onClick={handleCloseModal}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transaction Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter transaction title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transaction Type
                </label>
                <select
                  value={editForm.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={editForm.time}
                  onChange={(e) => handleFormChange('time', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
              <Button
                onClick={handleCloseModal}
                variant="outline"
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTransaction}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Transaction
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;