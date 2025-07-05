"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  PieChart, 
  Target,
  ChevronRight,
  User,
  DollarSign,
  Download,
  MessageSquare,
  Bot
} from 'lucide-react';
import { useRouter } from 'next/navigation';
const Homepage = () => {
const router=useRouter()
  const navigate=(screen)=>{
    switch(screen){
      case 'track':
        router.push('/track')
        break;
          case 'cateogry':
        router.push('/categorization')
        break;
        case 'chatbot':
        router.push('/chatBot')
        break;
          case 'budget':
        router.push('/budget')
        break;
    }
  }
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-green-400">Financial Visualizer</h1>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to Your Financial Dashboard
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Manage your expenses efficiently with our comprehensive tools
          </p>
        </div>
        <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          <Card onClick={()=>{navigate('track')}} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group cursor-pointer" >
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl mb-2">Budget Tracking</CardTitle>
              <CardDescription className="text-gray-400 text-base leading-relaxed">
                Monitor your spending patterns and track your financial goals with real-time budget updates and insights.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-green-400 font-medium group-hover:text-green-300 transition-colors">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Start Tracking</span>
                <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
          <Card onClick={()=>{navigate('cateogry')}} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group cursor-pointer">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl mb-2">Categorization</CardTitle>
              <CardDescription className="text-gray-400 text-base leading-relaxed">
                Organize and categorize your expenses automatically. Get detailed breakdowns of where your money goes. <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md font-medium">Download reports as PDF</span>.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-green-400 font-medium group-hover:text-green-300 transition-colors">
                <PieChart className="w-4 h-4 mr-1" />
                <span>View Categories</span>
                <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
          <Card onClick={()=>{navigate('budget')}} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group cursor-pointer">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl mb-2">Budgeting</CardTitle>
              <CardDescription className="text-gray-400 text-base leading-relaxed">
                Set financial goals and create custom budgets. Get alerts when you are close to your spending limits.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-green-400 font-medium group-hover:text-green-300 transition-colors">
                <Target className="w-4 h-4 mr-1" />
                <span>Set Budget</span>
                <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
          <Card onClick={()=>{navigate('chatbot')}} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group cursor-pointer">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl mb-2">Financial Chatbot</CardTitle>
              <CardDescription className="text-gray-400 text-base leading-relaxed">
                Get instant financial advice and answers to your money questions with our AI-powered assistant.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-green-400 font-medium group-hover:text-green-300 transition-colors">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>Chat Now</span>
                <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Homepage;