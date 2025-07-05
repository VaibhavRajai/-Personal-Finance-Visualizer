"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  DollarSign,
  PieChart,
  Calculator,
  Target,
  CreditCard,
  Loader2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function FinancialChatbot() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const GEMINI_API_KEY = 'AIzaSyBLA_rAu425RZr4kQDZzqafh_M48_ymJfM';

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        type: 'bot',
        content: "Hello! I am your AI Financial Advisor. I'm here to help you with budgeting, saving strategies, investment advice, expense management, and all things related to personal finance. What financial topic would you like to discuss today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBackClick = () => {
    window.location.href = 'https://personal-finance-visualizer-ochre-six.vercel.app/';
  };

  const quickSuggestions = [
    {
      icon: DollarSign,
      text: "Budget Planning",
      message: "Help me create a monthly budget plan",
      color: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400"
    },
    {
      icon: TrendingUp,
      text: "Investment Tips",
      message: "What are some good investment strategies for beginners?",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
    },
    {
      icon: PieChart,
      text: "Expense Analysis",
      message: "How can I track and analyze my monthly expenses?",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400"
    },
    {
      icon: Calculator,
      text: "Savings Goals",
      message: "Help me set up a savings plan for my financial goals",
      color: "from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400"
    },
    {
      icon: Target,
      text: "Emergency Fund",
      message: "How much should I save for an emergency fund?",
      color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400"
    },
    {
      icon: CreditCard,
      text: "Debt Management",
      message: "What's the best strategy to pay off my debts?",
      color: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400"
    }
  ];

  const sendChatMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || chatLoading) return;

    const userMessage = messageText.trim();
    setInputMessage('');
    
    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setChatLoading(true);

    const prompt = `You are a specialized AI Financial Advisor and personal finance expert. You can ONLY discuss topics related to:

FINANCIAL TOPICS YOU CAN HELP WITH:
- Personal finance and budgeting
- Expense management and tracking
- Saving strategies and techniques
- Investment basics and portfolio management
- Financial planning and goal setting
- Money management tips and best practices
- Debt management and credit improvement
- Emergency fund planning
- Retirement planning
- Tax planning strategies
- Insurance and risk management
- Banking and financial products
- Financial habits and behavior

IMPORTANT RULES:
- If someone asks about topics outside of finance/money, politely redirect them back to financial topics
- Always provide practical, actionable advice
- Be encouraging and supportive
- Keep responses helpful but concise
- Focus on education and empowerment
- Avoid giving specific investment recommendations for individual stocks
- Always suggest consulting with a certified financial planner for complex situations

User question: "${userMessage}"

Please provide helpful, accurate financial advice while being encouraging and supportive. If the question is not finance-related, politely redirect to financial topics and offer to help with money management instead.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const botResponse = data.candidates[0].content.parts[0].text;
        const newBotMessage = {
          type: 'bot',
          content: botResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newBotMessage]);
      } else {
        console.error('Unexpected API response structure:', data);
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: 'I apologize, but I encountered an unexpected response format. Please try asking your financial question again.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `I apologize, but I encountered a technical issue: ${error.message}. Please check your connection and try again. I'm here to help with any financial questions you have!`,
        timestamp: new Date()
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendChatMessage(suggestion.message);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <nav className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back </span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  AI Financial Advisor
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
    
            </div>
          </div>
        </div>
      </nav>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {messages.length <= 1 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Quick Questions to Get Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`group p-4 rounded-xl bg-gradient-to-r ${suggestion.color} border backdrop-blur-sm hover:scale-105 transition-all duration-300 text-left`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <suggestion.icon className="w-5 h-5" />
                    <span className="font-medium">{suggestion.text}</span>
                  </div>
                  <p className="text-sm text-gray-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    {suggestion.message}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-green-500/20 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Financial Advisor Chat</h3>
                <p className="text-sm text-green-400">Ask me anything about personal finance!</p>
              </div>
            </div>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-green-500/20 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-500/20 border border-blue-500/30' 
                      : 'bg-green-500/20 border border-green-500/30'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Bot className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100'
                      : 'bg-green-500/10 border border-green-500/20 text-green-100'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {chatLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-400" />
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                    <span className="text-green-400 text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-green-500/20 p-4">
            <div className="flex gap-3">
              <input
                ref={chatInputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about budgeting, investing, saving, or any financial topic..."
                className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all duration-200"
                disabled={chatLoading}
              />
              <button
                onClick={() => sendChatMessage()}
                disabled={!inputMessage.trim() || chatLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              I am specialized in financial advice. Ask me about money management, budgeting, investing,finance, and more!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}