"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  DollarSign,
  Calendar,
  FileText,
  Tag,
  Coffee,
  Car,
  Home,
  ShoppingBag,
  Utensils,
  Gamepad2,
  Heart,
  GraduationCap,
  Plane,
  Gift,
  Briefcase,
  CreditCard,
  Zap,
  Phone,
  TrendingUp,
  Shirt,
  Music,
  Dumbbell,
  PiggyBank,
  Building,
  Stethoscope,
  Fuel,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, transactionType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            {transactionType === 'income' ? 'Income' : 'Expense'} Added Successfully!
          </h3>
          
          <p className="text-gray-300 mb-6">
            Your {transactionType} has been recorded and saved to your account.
          </p>
          
          <Button
            onClick={onClose}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-all duration-300"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

const ErrorModal = ({ isOpen, onClose, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            Error Adding Transaction
          </h3>
          
          <p className="text-gray-300 mb-6">
            {error || 'Something went wrong. Please try again.'}
          </p>
          
          <Button
            onClick={onClose}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-all duration-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddTransactionPage = () => {
  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000000); 
  };
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    description: '',
    category: '',
    type: 'expense'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    setMounted(true);
    setFormData(prev => ({
      ...prev,
      date: getTodayDate()
    }));
  }, []);

  const categories = [
    { id: 'food', name: 'Food & Dining', icon: Utensils, color: 'bg-orange-500' },
    { id: 'transport', name: 'Transportation', icon: Car, color: 'bg-blue-500' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-green-500' },
    { id: 'entertainment', name: 'Entertainment', icon: Gamepad2, color: 'bg-purple-500' },
    { id: 'utilities', name: 'Utilities', icon: Zap, color: 'bg-yellow-500' },
    { id: 'healthcare', name: 'Healthcare', icon: Stethoscope, color: 'bg-red-500' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-indigo-500' },
    { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-cyan-500' },
    { id: 'gifts', name: 'Gifts & Donations', icon: Gift, color: 'bg-pink-500' },
    { id: 'salary', name: 'Salary', icon: Briefcase, color: 'bg-green-600' },
    { id: 'freelance', name: 'Freelance', icon: CreditCard, color: 'bg-blue-600' },
    { id: 'investment', name: 'Investment', icon: TrendingUp, color: 'bg-emerald-500' },
    { id: 'rent', name: 'Rent', icon: Home, color: 'bg-gray-500' },
    { id: 'clothing', name: 'Clothing', icon: Shirt, color: 'bg-violet-500' },
    { id: 'music', name: 'Music & Media', icon: Music, color: 'bg-rose-500' },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'bg-amber-500' },
    { id: 'savings', name: 'Savings', icon: PiggyBank, color: 'bg-teal-500' },
    { id: 'business', name: 'Business', icon: Building, color: 'bg-slate-500' },
    { id: 'fuel', name: 'Fuel', icon: Fuel, color: 'bg-stone-500' },
    { id: 'phone', name: 'Phone & Internet', icon: Phone, color: 'bg-sky-500' },
    { id: 'coffee', name: 'Coffee & Snacks', icon: Coffee, color: 'bg-orange-600' },
    { id: 'other', name: 'Other', icon: Tag, color: 'bg-gray-600' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoBack = () => {
    window.location.href='/track'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const transactionId = generateRandomId();
      const transactionData = {
        id: transactionId,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description.trim(),
        cateogry: formData.category, 
        type: formData.type
      };
      console.log('Sending transaction data:', transactionData);
      const response = await fetch('https://finance-visualizer-backend.vercel.app/api/addTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Try to get response text for debugging
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        // Try to parse error response
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
        
        throw new Error(errorMessage);
      }

      // Try to parse success response
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.log('Could not parse success response as JSON, but request succeeded');
        result = { success: true };
      }

      console.log('Transaction added successfully:', result);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        amount: '',
        date: getTodayDate(),
        description: '',
        category: '',
        type: 'expense'
      });

    } catch (error) {
      console.error('Error adding transaction:', error);
      setError(error.message || 'Failed to add transaction. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    handleGoBack();
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setError('');
  };

  const isFormValid = formData.amount && formData.date && formData.description && formData.category;
  const today = mounted ? getTodayDate() : '';

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGoBack}
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-green-400">Add Transaction</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">New Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleInputChange('type', 'expense')}
                    variant={formData.type === 'expense' ? 'default' : 'outline'}
                    className={`h-12 ${
                      formData.type === 'expense' 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2 rotate-180" />
                    Expense
                  </Button>
                  <Button
                    onClick={() => handleInputChange('type', 'income')}
                    variant={formData.type === 'income' ? 'default' : 'outline'}
                    className={`h-12 ${
                      formData.type === 'income' 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Income
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    max={today}
                    className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter transaction description..."
                    rows={3}
                    className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Button
                        key={category.id}
                        type="button"
                        variant="outline"
                        onClick={() => handleInputChange('category', category.id)}
                        className={`h-16 flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                          formData.category === category.id
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <div className={`w-8 h-8 ${formData.category === category.id ? 'bg-white/20' : category.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs text-center leading-tight">{category.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="pt-6 border-t border-gray-700">
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Transaction...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Add Transaction
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleModalClose} 
        transactionType={formData.type}
      />
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={handleErrorModalClose} 
        error={error}
      />
    </div>
  );
};

export default AddTransactionPage;