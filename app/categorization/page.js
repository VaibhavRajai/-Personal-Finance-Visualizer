"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  Car,
  Home,
  ShoppingBag,
  Gamepad2,
  Calendar,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  ArrowLeft
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showAmounts, setShowAmounts] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const COLORS = [
    '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', 
    '#F59E0B', '#EC4899', '#6366F1', '#06B6D4', 
    '#F97316', '#6B7280'
  ];

  const handleBackClick = () => {
    window.location.href = 'https://personal-finance-visualizer-ochre-six.vercel.app/';
  };

  const getIconForCategory = (category) => {
    const iconMap = {
      "Food & Dining": ShoppingBag,
      "Transportation": Car,
      "Entertainment": Gamepad2,
      "Utilities": Home,
      "Shopping": ShoppingBag,
      "Healthcare": Home,
      "Education": Home,
      "Travel": Car,
      "Other": CreditCard,
      "Income": DollarSign
    };
    return iconMap[category] || CreditCard;
  };

  const exportToPDF = async () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }
    setIsDownloading(true);
    try {
      const jsPDFScript = document.createElement('script');
      jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      
      const autoTableScript = document.createElement('script');
      autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js';
      await new Promise((resolve, reject) => {
        let scriptsLoaded = 0;
        const totalScripts = 2;
        const onScriptLoad = () => {
          scriptsLoaded++;
          if (scriptsLoaded === totalScripts) {
            resolve();
          }
        };
        jsPDFScript.onload = onScriptLoad;
        jsPDFScript.onerror = reject;
        autoTableScript.onload = onScriptLoad;
        autoTableScript.onerror = reject;
        
        document.head.appendChild(jsPDFScript);
        document.head.appendChild(autoTableScript);
      });
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("Financial Dashboard Report", 14, 22);
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      doc.text(`Total Transactions: ${transactions.length}`, 14, 40);
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const netBalance = totalIncome - totalExpenses;  
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Financial Summary:", 14, 55);
      doc.setFontSize(12);
      doc.setTextColor(34, 197, 94);
      doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 14, 65);
      doc.setTextColor(239, 68, 68); 
      doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 14, 73);
      
      doc.setTextColor(netBalance >= 0 ? 34 : 239, netBalance >= 0 ? 197 : 68, netBalance >= 0 ? 94 : 68);
      doc.text(`Net Balance: ${formatCurrency(netBalance)}`, 14, 81);
      const tableColumn = ["Title", "Amount", "Category", "Type", "Date"];
      const tableRows = [];
      const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date + ' ' + (b.time || '00:00')) - new Date(a.date + ' ' + (a.time || '00:00'))
      );
      
      sortedTransactions.forEach((transaction) => {
        const transactionData = [
          transaction.title || 'N/A',
          formatCurrency(Math.abs(transaction.amount)),
          transaction.category || 'N/A',
          transaction.type.toUpperCase(),
          formatDate(transaction.date)
        ];
        tableRows.push(transactionData);
      });
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: 'striped',
        headStyles: {
          fillColor: [34, 197, 94], 
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [50, 50, 50]
        },
        columnStyles: {
          1: { halign: 'right' }, 
          3: { 
            cellWidth: 20,
            fillColor: function(rowIndex, columnIndex, cellValue) {
              return cellValue === 'INCOME' ? [34, 197, 94, 0.1] : [239, 68, 68, 0.1];
            },
            textColor: function(rowIndex, columnIndex, cellValue) {
              return cellValue === 'INCOME' ? [34, 197, 94] : [239, 68, 68];
            }
          }
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 90 }
      });
      const finalY = doc.lastAutoTable.finalY || 90;
      
      if (finalY < 200) { 
        const categoryBreakdown = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => {
            const category = t.category || 'Other';
            acc[category] = (acc[category] || 0) + Math.abs(t.amount);
            return acc;
          }, {});
        
        const categoryData = Object.entries(categoryBreakdown)
          .map(([category, amount]) => ({
            name: category,
            value: amount,
            percentage: ((amount / totalExpenses) * 100).toFixed(1)
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); 
        if (categoryData.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(40, 40, 40);
          doc.text("Top Spending Categories:", 14, finalY + 15);
          
          const categoryTableColumn = ["Category", "Amount", "% of Total"];
          const categoryTableRows = [];
          
          categoryData.forEach((category) => {
            categoryTableRows.push([
              category.name,
              formatCurrency(category.value),
              category.percentage + '%'
            ]);
          });
          
          doc.autoTable({
            head: [categoryTableColumn],
            body: categoryTableRows,
            startY: finalY + 20,
            theme: 'striped',
            headStyles: {
              fillColor: [59, 130, 246], 
              textColor: [255, 255, 255],
              fontSize: 10,
              fontStyle: 'bold'
            },
            bodyStyles: {
              fontSize: 9,
              textColor: [50, 50, 50]
            },
            columnStyles: {
              1: { halign: 'right' }, 
              2: { halign: 'right' }  
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245]
            }
          });
        }
      }
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Generated by Financial Dashboard", 14, doc.internal.pageSize.height - 10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
      const fileName = `Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      document.head.removeChild(jsPDFScript);
      document.head.removeChild(autoTableScript);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
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
          category: transaction.category || transaction.cateogry || 'Other', // Handle typo in API
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
    setMounted(true);
    fetchTransactions();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;
  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category || 'Other';
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const categoryData = Object.entries(categoryBreakdown)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => b.value - a.value);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date + ' ' + (b.time || '00:00')) - new Date(a.date + ' ' + (a.time || '00:00')))
    .slice(0, 5);

  const monthlyData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const monthlyChartData = Object.entries(monthlyData)
    .map(([month, amount]) => ({ month, amount }))
    .slice(-6);

  const formatAmount = (amount) => {
    if (!showAmounts) return '₹••••';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-green-400">
            {formatAmount(payload[0].value)} ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

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
                <h1 className="text-lg sm:text-xl font-bold text-green-400">Financial Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
                onClick={() => setShowAmounts(!showAmounts)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                {showAmounts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                onClick={exportToPDF}
                disabled={isDownloading || transactions.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </>
                )}
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

        {isLoading && (
          <div className="mb-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-blue-400 font-medium">Loading transactions...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Income</p>
                  <p className="text-2xl font-bold text-green-400">{formatAmount(totalIncome)}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <ArrowUpCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-400">{formatAmount(totalExpenses)}</p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <ArrowDownCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Net Balance</p>
                  <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatAmount(netBalance)}
                  </p>
                </div>
                <div className={`w-12 h-12 ${netBalance >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-xl flex items-center justify-center`}>
                  {netBalance >= 0 ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingDown className="w-6 h-6 text-white" />}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Transactions</p>
                  <p className="text-2xl font-bold text-blue-400">{transactions.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Expense Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-400">No expense data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Monthly Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyChartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [formatAmount(value), 'Amount']}
                      />
                      <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-400">No spending data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Top Spending Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.slice(0, 6).map((category, index) => {
              const IconComponent = getIconForCategory(category.name);
              return (
                <Card key={category.name} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{category.name}</p>
                          <p className="text-gray-400 text-sm">{category.percentage}% of expenses</p>
                        </div>
                      </div>
                      <p className="text-white font-bold">{formatAmount(category.value)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const IconComponent = transaction.type === 'income' ? ArrowUpCircle : ArrowDownCircle;
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{transaction.title}</p>
                          <p className="text-gray-400 text-sm">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))}
                        </p>
                        <p className="text-gray-400 text-sm">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;