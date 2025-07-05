"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle,
  Edit3,
  Save,
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  Settings,
  Car,
  Home,
  ShoppingBag,
  Gamepad2,
  CreditCard,
  Coffee,
  Heart,
  GraduationCap,
  Plane,
  ArrowLeft
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const BudgetManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAmount, setEditingAmount] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showInsights, setShowInsights] = useState(true);

  const COLORS = {
    success: '#10B981',
    warning: '#F59E0B', 
    danger: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6',
    pink: '#EC4899',
    indigo: '#6366F1',
    cyan: '#06B6D4',
    orange: '#F97316',
    gray: '#6B7280'
  };

  const CATEGORY_COLORS = [
    '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', 
    '#F59E0B', '#EC4899', '#6366F1', '#06B6D4', 
    '#F97316', '#6B7280'
  ];

  const getIconForCategory = (category) => {
    const iconMap = {
      "Food & Dining": Coffee,
      "Transportation": Car,
      "Entertainment": Gamepad2,
      "Utilities": Home,
      "Shopping": ShoppingBag,
      "Healthcare": Heart,
      "Education": GraduationCap,
      "Travel": Plane,
      "Other": CreditCard,
      "Income": DollarSign,
      "Groceries": ShoppingBag,
      "Rent": Home,
      "Gas": Car,
      "Movies": Gamepad2
    };
    return iconMap[category] || CreditCard;
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://finance-visualizer-backend.vercel.app/api/getTransactions');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      let transactionsArray = [];
      
      if (Array.isArray(data)) {
        transactionsArray = data;
      } else if (data && Array.isArray(data.transactions)) {
        transactionsArray = data.transactions;
      } else if (data && Array.isArray(data.data)) {
        transactionsArray = data.data;
      } else if (data && data.message) {
        setTransactions([]);
        return;
      } else {
        throw new Error('Unexpected data format from API');
      }
      
      const processedTransactions = transactionsArray
        .filter(transaction => transaction && typeof transaction === 'object')
        .map(transaction => ({
          id: transaction.id || Math.random().toString(36).substr(2, 9),
          title: transaction.title || transaction.description || 'Untitled Transaction',
          category: transaction.category || transaction.cateogry || 'Other',
          amount: parseFloat(transaction.amount) || 0,
          date: transaction.date || new Date().toISOString().split('T')[0],
          time: transaction.time || '00:00',
          type: transaction.type || (transaction.amount > 0 ? 'income' : 'expense'),
          ...transaction
        }));
      
      setTransactions(processedTransactions);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.message);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const savedBudgets = {};
    setBudgets(savedBudgets);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getMonthlyExpenses = (month) => {
    return transactions
      .filter(t => {
        const transactionMonth = t.date.slice(0, 7);
        return t.type === 'expense' && transactionMonth === month;
      })
      .reduce((acc, t) => {
        const category = t.category || 'Other';
        acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        return acc;
      }, {});
  };

  const getCurrentMonthExpenses = () => {
    return getMonthlyExpenses(selectedMonth);
  };

  const getAllCategories = () => {
    const categories = new Set();
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categories.add(t.category || 'Other');
      }
    });
    return Array.from(categories).sort();
  };

  const setBudget = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      [category]: parseFloat(amount) || 0
    }));
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setEditingAmount(budgets[category]?.toString() || '');
  };

  const saveEdit = () => {
    if (editingCategory && editingAmount) {
      setBudget(editingCategory, editingAmount);
    }
    setEditingCategory(null);
    setEditingAmount('');
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingAmount('');
  };

  const getBudgetStatus = (category, spent, budget) => {
    if (!budget) return 'no-budget';
    
    const percentage = (spent / budget) * 100;
    
    if (percentage <= 50) return 'good';
    if (percentage <= 80) return 'warning';
    if (percentage <= 100) return 'danger';
    return 'over-budget';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return COLORS.success;
      case 'warning': return COLORS.warning;
      case 'danger': return COLORS.danger;
      case 'over-budget': return COLORS.danger;
      default: return COLORS.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'danger': return AlertTriangle;
      case 'over-budget': return X;
      default: return Target;
    }
  };

  const generateInsights = () => {
    const expenses = getCurrentMonthExpenses();
    const insights = [];

    const totalSpent = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
    const totalBudget = Object.values(budgets).reduce((sum, amount) => sum + amount, 0);
    
    if (totalBudget > 0) {
      const percentage = (totalSpent / totalBudget) * 100;
      insights.push({
        type: percentage > 100 ? 'danger' : percentage > 80 ? 'warning' : 'info',
        title: 'Overall Budget Status',
        message: `You've spent ${formatCurrency(totalSpent)} out of ${formatCurrency(totalBudget)} (${percentage.toFixed(1)}%)`
      });
    }
    Object.entries(expenses).forEach(([category, spent]) => {
      const budget = budgets[category];
      if (budget) {
        const percentage = (spent / budget) * 100;
        if (percentage > 100) {
          insights.push({
            type: 'danger',
            title: `${category} Over Budget`,
            message: `Exceeded budget by ${formatCurrency(spent - budget)}`
          });
        } else if (percentage > 80) {
          insights.push({
            type: 'warning',
            title: `${category} Near Limit`,
            message: `${percentage.toFixed(1)}% of budget used`
          });
        }
      }
    });
    
    const topCategories = Object.entries(expenses)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    if (topCategories.length > 0) {
      insights.push({
        type: 'info',
        title: 'Top Spending Categories',
        message: topCategories.map(([cat, amt]) => `${cat}: ${formatCurrency(amt)}`).join(', ')
      });
    }
    
    return insights;
  };

  const getBudgetComparisonData = () => {
    const expenses = getCurrentMonthExpenses();
    const categories = getAllCategories();
    
    return categories.map(category => ({
      category,
      budget: budgets[category] || 0,
      spent: expenses[category] || 0,
      remaining: Math.max(0, (budgets[category] || 0) - (expenses[category] || 0))
    })).filter(item => item.budget > 0 || item.spent > 0);
  };

  const getMonthlyTrend = () => {
    const last6Months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const expenses = getMonthlyExpenses(monthStr);
      const totalSpent = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
      const totalBudget = Object.values(budgets).reduce((sum, amount) => sum + amount, 0);
      
      last6Months.push({
        month: monthName,
        spent: totalSpent,
        budget: totalBudget
      });
    }
    
    return last6Months;
  };

  const handleBackClick = () => {
    window.location.href = 'https://personal-finance-visualizer-ochre-six.vercel.app/';
  };

  const expenses = getCurrentMonthExpenses();
  const categories = getAllCategories();
  const budgetData = getBudgetComparisonData();
  const insights = generateInsights();
  const monthlyTrend = getMonthlyTrend();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">Loading Budget Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackClick}
                variant="outline"
                className="border-gray-600 text-black-300 hover:bg-green-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-blue-400" />
                <h1 className="text-lg sm:text-xl font-bold text-blue-400">Budget Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
              />
              <Button
                onClick={fetchTransactions}
                disabled={isLoading}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={() => setShowInsights(!showInsights)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showInsights ? 'Hide' : 'Show'} Insights
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-red-400 font-medium">Error loading data</span>
              </div>
              <Button
                onClick={fetchTransactions}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-900/50"
              >
                Retry
              </Button>
            </div>
            <p className="text-red-300 text-sm mt-2">{error}</p>
          </div>
        )}
        {showInsights && insights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Spending Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        insight.type === 'danger' ? 'bg-red-500' :
                        insight.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div>
                        <h3 className="text-white font-medium">{insight.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{insight.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Budget</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatCurrency(Object.values(budgets).reduce((sum, amount) => sum + amount, 0))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-red-400">
                    {formatCurrency(Object.values(expenses).reduce((sum, amount) => sum + amount, 0))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Remaining</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(Math.max(0, Object.values(budgets).reduce((sum, amount) => sum + amount, 0) - Object.values(expenses).reduce((sum, amount) => sum + amount, 0)))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Budget vs Actual Spending</CardTitle>
            </CardHeader>
            <CardContent>
              {budgetData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="category" 
                        stroke="#9CA3AF"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [formatCurrency(value)]}
                      />
                      <Legend />
                      <Bar dataKey="budget" fill="#3B82F6" name="Budget" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="spent" fill="#EF4444" name="Spent" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Set budgets to see comparison</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">6-Month Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [formatCurrency(value)]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="spent" stroke="#EF4444" strokeWidth={2} name="Spent" />
                    <Line type="monotone" dataKey="budget" stroke="#3B82F6" strokeWidth={2} name="Budget" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Category Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const spent = expenses[category] || 0;
                const budget = budgets[category] || 0;
                const status = getBudgetStatus(category, spent, budget);
                const StatusIcon = getStatusIcon(status);
                const IconComponent = getIconForCategory(category);
                const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                
                return (
                  <div key={category} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{category}</h3>
                          <p className="text-gray-400 text-sm">
                            {formatCurrency(spent)} spent
                            {budget > 0 && ` of ${formatCurrency(budget)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <StatusIcon 
                          className={`w-5 h-5`}
                          style={{ color: getStatusColor(status) }}
                        />
                        <div className="flex items-center space-x-2">
                          {editingCategory === category ? (
                            <>
                              <input
                                type="number"
                                value={editingAmount}
                                onChange={(e) => setEditingAmount(e.target.value)}
                                className="w-20 bg-gray-600 border border-gray-500 text-white rounded px-2 py-1 text-sm"
                                placeholder="Budget"
                              />
                              <Button
                                onClick={saveEdit}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={cancelEdit}
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => startEditing(category)}
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              {budget > 0 ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {budget > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{percentage.toFixed(1)}% used</span>
                          <span className="text-gray-400">{formatCurrency(Math.max(0, budget - spent))} remaining</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: getStatusColor(status)
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetManagement;