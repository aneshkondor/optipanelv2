import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MessageSquare, BarChart3, Sparkles, X, Save, Plus, Trash2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chart?: {
    type: 'line' | 'bar' | 'area';
    data: any[];
    title: string;
    dataKeys: string[];
  };
}

interface SavedGraph {
  id: string;
  title: string;
  type: string;
  date: string;
  chart: {
    type: 'line' | 'bar' | 'area';
    data: any[];
    dataKeys: string[];
  };
}

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  preview: string;
  messages: Message[];
}

interface DataSource {
  name: string;
  owner: string;
  freshness: string;
  usage: string;
  description: string;
}

export function AIChatPanel() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [showPreviousChats, setShowPreviousChats] = useState(false);
  const [showSavedGraphs, setShowSavedGraphs] = useState(false);
  const [showDataCatalog, setShowDataCatalog] = useState(false);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [savedGraphs, setSavedGraphs] = useState<SavedGraph[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<SavedGraph | null>(null);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [graphToDelete, setGraphToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dataSources: DataSource[] = [
    {
      name: 'Monthly Recurring Revenue',
      owner: 'Finance Team',
      freshness: 'Real-time',
      usage: 'High',
      description: 'Sum of all recurring subscription revenue normalized to monthly',
    },
    {
      name: 'Active Users',
      owner: 'Product Team',
      freshness: '1 hour',
      usage: 'High',
      description: 'Count of unique users with activity in last 30 days',
    },
    {
      name: 'Customer Acquisition Cost',
      owner: 'Growth Team',
      freshness: 'Daily',
      usage: 'Medium',
      description: 'Total marketing spend divided by new customers acquired',
    },
    {
      name: 'Net Revenue Retention',
      owner: 'Finance Team',
      freshness: 'Daily',
      usage: 'Medium',
      description: 'Revenue retained from existing customers including expansion',
    },
    {
      name: 'Conversion Rate',
      owner: 'Growth Team',
      freshness: 'Real-time',
      usage: 'High',
      description: 'Percentage of users who complete desired action',
    },
    {
      name: 'Customer Lifetime Value',
      owner: 'Finance Team',
      freshness: 'Daily',
      usage: 'High',
      description: 'Predicted revenue from a customer over their lifetime',
    },
  ];

  // Load saved graphs and chat histories from localStorage
  useEffect(() => {
    const storedGraphs = localStorage.getItem('savedGraphs');
    if (storedGraphs) {
      setSavedGraphs(JSON.parse(storedGraphs));
    }

    const storedChats = localStorage.getItem('chatHistories');
    if (storedChats) {
      const parsed = JSON.parse(storedChats);
      // Convert timestamp strings back to Date objects
      const chatsWithDates = parsed.map((chat: any) => ({
        ...chat,
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      setChatHistories(chatsWithDates);
    }
  }, []);

  // Check for queries from other pages - runs continuously to catch new queries even when already on the page
  useEffect(() => {
    const checkForNewQuery = () => {
      const aiChatQuery = sessionStorage.getItem('aiChatQuery');
      if (aiChatQuery) {
        sessionStorage.removeItem('aiChatQuery');
        
        // Auto-submit the query
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: aiChatQuery,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        
        // Simulate AI response
        setTimeout(() => {
          const aiResponse = generateMockResponse(aiChatQuery);
          setMessages(prev => [...prev, aiResponse]);
          setIsTyping(false);
        }, 1500);
      }
    };

    // Check immediately on mount
    checkForNewQuery();

    // Set up an interval to check periodically (every 100ms)
    const interval = setInterval(checkForNewQuery, 100);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save current chat when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages]);

  const saveChatHistory = () => {
    if (messages.length === 0) return;

    const chatId = currentChatId || Date.now().toString();
    const userMessages = messages.filter(m => m.role === 'user');
    const firstUserMessage = userMessages[0]?.content || 'New Chat';
    
    const chatHistory: ChatHistory = {
      id: chatId,
      title: firstUserMessage.slice(0, 50) + (firstUserMessage.length > 50 ? '...' : ''),
      date: new Date().toLocaleString(),
      preview: firstUserMessage,
      messages: messages,
    };

    const existingIndex = chatHistories.findIndex(c => c.id === chatId);
    let updatedChats;
    
    if (existingIndex >= 0) {
      updatedChats = [...chatHistories];
      updatedChats[existingIndex] = chatHistory;
    } else {
      updatedChats = [chatHistory, ...chatHistories];
    }

    setChatHistories(updatedChats);
    setCurrentChatId(chatId);
    localStorage.setItem('chatHistories', JSON.stringify(updatedChats));
  };

  const loadChatHistory = (chatId: string) => {
    const chat = chatHistories.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setShowPreviousChats(false);
    }
  };

  const deleteChat = (chatId: string) => {
    const updated = chatHistories.filter(c => c.id !== chatId);
    setChatHistories(updated);
    localStorage.setItem('chatHistories', JSON.stringify(updated));
    
    // If we're deleting the current chat, clear messages
    if (chatId === currentChatId) {
      setMessages([]);
      setCurrentChatId(null);
    }
    
    toast.success('Chat deleted');
    setChatToDelete(null);
  };

  const deleteGraph = (graphId: string) => {
    const updated = savedGraphs.filter(g => g.id !== graphId);
    setSavedGraphs(updated);
    localStorage.setItem('savedGraphs', JSON.stringify(updated));
    
    // Also remove from dashboard if present
    const dashboardWidgets = localStorage.getItem('dashboardWidgets');
    if (dashboardWidgets) {
      const widgets = JSON.parse(dashboardWidgets);
      const updatedWidgets = widgets.filter((w: any) => w.id !== graphId);
      localStorage.setItem('dashboardWidgets', JSON.stringify(updatedWidgets));
    }
    
    toast.success('Graph deleted');
    setGraphToDelete(null);
    setSelectedGraph(null);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const generateMockResponse = (userQuery: string): Message => {
    const lowerQuery = userQuery.toLowerCase();
    
    // Revenue-related queries
    if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Here's your revenue analysis for the past 6 months. The data shows a strong upward trend with 24% growth quarter-over-quarter.",
        timestamp: new Date(),
        chart: {
          type: 'area',
          title: 'Revenue Trend (6 Months)',
          data: [
            { month: 'Jan', revenue: 220000, target: 200000 },
            { month: 'Feb', revenue: 235000, target: 210000 },
            { month: 'Mar', revenue: 248000, target: 220000 },
            { month: 'Apr', revenue: 255000, target: 230000 },
            { month: 'May', revenue: 268000, target: 240000 },
            { month: 'Jun', revenue: 285000, target: 250000 },
          ],
          dataKeys: ['revenue', 'target'],
        },
      };
    }
    
    // Retention queries
    if (lowerQuery.includes('retention') || lowerQuery.includes('churn')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Your current user retention rate is 87.3%, which is above the industry average of 75%. Here's the breakdown by cohort:",
        timestamp: new Date(),
        chart: {
          type: 'line',
          title: 'User Retention by Cohort',
          data: [
            { week: 'Week 0', cohort1: 100, cohort2: 100, cohort3: 100 },
            { week: 'Week 1', cohort1: 92, cohort2: 89, cohort3: 91 },
            { week: 'Week 2', cohort1: 87, cohort2: 84, cohort3: 88 },
            { week: 'Week 3', cohort1: 83, cohort2: 80, cohort3: 85 },
            { week: 'Week 4', cohort1: 79, cohort2: 77, cohort3: 82 },
          ],
          dataKeys: ['cohort1', 'cohort2', 'cohort3'],
        },
      };
    }
    
    // Conversion queries
    if (lowerQuery.includes('conversion') || lowerQuery.includes('channel')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Here's your conversion rate comparison across all marketing channels. Organic search is performing best at 8.2%.",
        timestamp: new Date(),
        chart: {
          type: 'bar',
          title: 'Conversion Rates by Channel',
          data: [
            { channel: 'Organic', rate: 8.2, users: 12500 },
            { channel: 'Paid', rate: 6.5, users: 8900 },
            { channel: 'Social', rate: 4.8, users: 6200 },
            { channel: 'Email', rate: 12.3, users: 4500 },
            { channel: 'Direct', rate: 9.7, users: 3800 },
          ],
          dataKeys: ['rate', 'users'],
        },
      };
    }
    
    // CAC/LTV queries
    if (lowerQuery.includes('cac') || lowerQuery.includes('ltv')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Your LTV:CAC ratio is currently 16.3:1, which is excellent. Here's the trend over the past quarters:",
        timestamp: new Date(),
        chart: {
          type: 'line',
          title: 'CAC vs LTV Analysis',
          data: [
            { quarter: 'Q1 2024', cac: 950, ltv: 13200 },
            { quarter: 'Q2 2024', cac: 920, ltv: 13800 },
            { quarter: 'Q3 2024', cac: 895, ltv: 14200 },
            { quarter: 'Q4 2024', cac: 870, ltv: 14500 },
            { quarter: 'Q1 2025', cac: 892, ltv: 14500 },
          ],
          dataKeys: ['cac', 'ltv'],
        },
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I've analyzed your query. Here are some key insights from your data. Would you like me to dive deeper into any specific metric?",
      timestamp: new Date(),
    };
  };

  const handleSend = async () => {
    if (query.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: query,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      const currentQuery = query;
      setQuery('');
      setIsTyping(true);

      try {
        // Call backend API with Claude
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: currentQuery }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();

        // Add AI response with chart
        const aiResponse: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
          chart: data.chart,
        };

        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('Error getting AI response:', error);

        // Fallback to mock response if backend fails
        const aiResponse = generateMockResponse(currentQuery);
        setMessages(prev => [...prev, aiResponse]);

        toast.error('Using fallback data - backend unavailable');
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveGraph = (message: Message) => {
    if (!message.chart) return;
    
    // Check if this graph already exists (by title and chart type)
    const exists = savedGraphs.find(
      g => g.title === message.chart!.title && g.chart.type === message.chart!.type
    );
    
    if (exists) {
      toast.error('This graph is already saved!');
      return;
    }
    
    const newGraph: SavedGraph = {
      id: Date.now().toString(),
      title: message.chart.title,
      type: message.chart.type === 'area' ? 'Area Chart' : message.chart.type === 'line' ? 'Line Chart' : 'Bar Chart',
      date: `Saved ${new Date().toLocaleTimeString()}`,
      chart: message.chart,
    };
    
    const updated = [...savedGraphs, newGraph];
    setSavedGraphs(updated);
    localStorage.setItem('savedGraphs', JSON.stringify(updated));
    toast.success('Graph saved successfully!');
  };

  const isGraphSaved = (message: Message): boolean => {
    if (!message.chart) return false;
    return savedGraphs.some(
      g => g.title === message.chart!.title && g.chart.type === message.chart!.type
    );
  };

  const handleAddToDashboard = (graph: SavedGraph) => {
    // Get existing dashboard widgets
    const existing = localStorage.getItem('dashboardWidgets') || '[]';
    const widgets = JSON.parse(existing);
    
    // Check if already exists
    if (widgets.find((w: any) => w.id === graph.id)) {
      toast.error('This graph is already on the dashboard');
      setSelectedGraph(null);
      return;
    }
    
    // Add new widget
    widgets.push({
      id: graph.id,
      type: 'chart',
      chart: graph.chart,
      title: graph.title,
    });
    
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    
    // Show success message and close modals
    toast.success('✓ Added to Executive Dashboard!', {
      description: 'View it in the Executive Dashboard page',
    });
    setSelectedGraph(null);
    setShowSavedGraphs(false);
  };

  const toggleDataSource = (sourceName: string) => {
    setSelectedDataSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(s => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  const renderChart = (chart: Message['chart']) => {
    if (!chart) return null;
    
    const ChartComponent = chart.type === 'line' ? LineChart : chart.type === 'area' ? AreaChart : BarChart;
    const DataComponent = chart.type === 'line' ? Line : chart.type === 'area' ? Area : Bar;
    
    return (
      <div className="w-full h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={Object.keys(chart.data[0])[0]} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            {chart.dataKeys.map((key, index) => (
              <DataComponent
                key={key}
                type="monotone"
                dataKey={key}
                stroke={index === 0 ? '#6E56CF' : '#8B5CF6'}
                fill={chart.type === 'area' ? `url(#gradient${index})` : index === 0 ? '#6E56CF' : '#8B5CF6'}
                strokeWidth={2}
              />
            ))}
            {chart.type === 'area' && chart.dataKeys.map((_, index) => (
              <defs key={index}>
                <linearGradient id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={index === 0 ? '#6E56CF' : '#8B5CF6'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={index === 0 ? '#6E56CF' : '#8B5CF6'} stopOpacity={0}/>
                </linearGradient>
              </defs>
            ))}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  };

  // Show empty state if no messages
  if (messages.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-4">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              OptiPanel AI
            </h1>
            <p className="text-muted-foreground text-lg">
              Ask anything about your data
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-3xl"
          >
            <div className="relative">
              <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur shadow-lg hover:shadow-xl transition-all">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask OptiPanel AI anything about your data..."
                  className="h-16 px-6 pr-36 text-lg border-0 bg-transparent rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-xl hover:bg-muted"
                    onClick={() => setShowDataCatalog(!showDataCatalog)}
                  >
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">Context</span>
                    {selectedDataSources.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedDataSources.length}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSend}
                    disabled={!query.trim()}
                    size="lg"
                    className="rounded-xl h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <Send className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {showDataCatalog && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 right-0 rounded-xl border border-border bg-card shadow-lg p-4 z-10 max-h-[400px] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div>
                        <span className="text-sm font-medium">Select Data Sources</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Choose metrics to include in analysis
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowDataCatalog(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {dataSources.map((source) => (
                        <button
                          key={source.name}
                          onClick={() => toggleDataSource(source.name)}
                          className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-colors text-left ${
                            selectedDataSources.includes(source.name)
                              ? 'bg-primary/10 border border-primary/50'
                              : 'hover:bg-muted border border-transparent'
                          }`}
                        >
                          <div className={`h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            selectedDataSources.includes(source.name)
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground/50'
                          }`}>
                            {selectedDataSources.includes(source.name) && (
                              <Database className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-sm font-medium truncate">{source.name}</span>
                              <Badge variant={source.usage === 'High' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                                {source.usage}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                              {source.description}
                            </p>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              <span>{source.owner}</span>
                              <span>•</span>
                              <span>{source.freshness}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {selectedDataSources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between px-1">
                        <span className="text-xs text-muted-foreground">
                          {selectedDataSources.length} source{selectedDataSources.length !== 1 ? 's' : ''} selected
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDataSources([])}
                          className="h-7 text-xs"
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 mt-6 justify-center"
            >
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-xl border-border/50 bg-card/50 backdrop-blur hover:bg-card hover:border-primary/50 transition-all hover:shadow-lg"
                onClick={() => setShowPreviousChats(true)}
              >
                <MessageSquare className="h-5 w-5" />
                Previous Chats
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-xl border-border/50 bg-card/50 backdrop-blur hover:bg-card hover:border-primary/50 transition-all hover:shadow-lg"
                onClick={() => setShowSavedGraphs(true)}
              >
                <BarChart3 className="h-5 w-5" />
                Saved Graphs
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-3xl mt-12"
          >
            <p className="text-xs text-muted-foreground mb-4 text-center">Try asking:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Show revenue trends for the past 6 months',
                'What is our current user retention rate?',
                'Compare conversion rates across channels',
                'Analyze CAC vs LTV by cohort',
              ].map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  onClick={() => setQuery(suggestion)}
                  className="p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur hover:bg-card hover:border-primary/50 transition-all text-left text-sm hover:shadow-md"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Previous Chats Modal */}
        <Dialog open={showPreviousChats} onOpenChange={setShowPreviousChats}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Previous Chats
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {chatHistories.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No previous chats yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start a conversation to see your chat history here
                  </p>
                </div>
              ) : (
                chatHistories.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <button
                      onClick={() => loadChatHistory(chat.id)}
                      className="w-full p-4 pr-12 rounded-xl border border-border hover:border-primary/50 bg-card hover:bg-muted transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {chat.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">{chat.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{chat.preview}</p>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatToDelete(chat.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Saved Graphs Modal */}
        <Dialog open={showSavedGraphs} onOpenChange={setShowSavedGraphs}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Saved Graphs
              </DialogTitle>
            </DialogHeader>
            {savedGraphs.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No saved graphs yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start a chat and save graphs to view them here
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {savedGraphs.map((graph, index) => (
                  <motion.div
                    key={graph.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <Card 
                      className="p-4 hover:shadow-lg transition-all cursor-pointer border-border hover:border-primary/50"
                      onClick={() => setSelectedGraph(graph)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {graph.type}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        {graph.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{graph.date}</p>
                    </Card>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGraphToDelete(graph.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Graph Detail Modal */}
        <Dialog open={!!selectedGraph} onOpenChange={() => setSelectedGraph(null)}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedGraph?.title}</DialogTitle>
            </DialogHeader>
            {selectedGraph && (
              <div className="mt-4">
                {renderChart(selectedGraph.chart)}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedGraph(null)}>
                Close
              </Button>
              <Button 
                onClick={() => selectedGraph && handleAddToDashboard(selectedGraph)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add to Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Chat Confirmation */}
        <AlertDialog open={!!chatToDelete} onOpenChange={() => setChatToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Chat</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this chat? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => chatToDelete && deleteChat(chatToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Graph Confirmation */}
        <AlertDialog open={!!graphToDelete} onOpenChange={() => setGraphToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Graph</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this saved graph? It will also be removed from your dashboard if present.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => graphToDelete && deleteGraph(graphToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Chat interface with messages
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Header with New Chat button */}
      <div className="border-b border-border bg-background/95 backdrop-blur p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="font-semibold">OptiPanel AI Chat</h2>
          <Button variant="outline" size="sm" onClick={startNewChat}>
            New Chat
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              
              <div className={`flex-1 max-w-3xl ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <Card className={`p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground max-w-lg' : 'bg-card'}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.chart && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{message.chart.title}</h4>
                        {isGraphSaved(message) ? (
                          <Badge variant="secondary" className="gap-2">
                            <Save className="h-3 w-3" />
                            Saved
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveGraph(message)}
                            className="gap-2 hover:bg-primary/10 hover:text-primary"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                        )}
                      </div>
                      {renderChart(message.chart)}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </Card>
              </div>
              
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium">You</span>
                </div>
              )}
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <Card className="p-4 bg-card">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </Card>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/95 backdrop-blur p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a follow-up question..."
              className="h-12 px-4 pr-32 border-border bg-card"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSavedGraphs(true)}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSend}
                disabled={!query.trim()}
                size="sm"
                className="h-8 px-4 bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Graphs Modal */}
      <Dialog open={showSavedGraphs} onOpenChange={setShowSavedGraphs}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Saved Graphs
            </DialogTitle>
          </DialogHeader>
          {savedGraphs.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No saved graphs yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click the Save button on any chart to save it
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {savedGraphs.map((graph, index) => (
                <motion.div
                  key={graph.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <Card 
                    className="p-4 hover:shadow-lg transition-all cursor-pointer border-border hover:border-primary/50"
                    onClick={() => setSelectedGraph(graph)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {graph.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                      {graph.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{graph.date}</p>
                  </Card>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGraphToDelete(graph.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Graph Detail Modal */}
      <Dialog open={!!selectedGraph} onOpenChange={() => setSelectedGraph(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedGraph?.title}</DialogTitle>
          </DialogHeader>
          {selectedGraph && (
            <div className="mt-4">
              {renderChart(selectedGraph.chart)}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedGraph(null)}>
              Close
            </Button>
            <Button 
              onClick={() => selectedGraph && handleAddToDashboard(selectedGraph)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Graph Confirmation */}
      <AlertDialog open={!!graphToDelete} onOpenChange={() => setGraphToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Graph</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this saved graph? It will also be removed from your dashboard if present.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => graphToDelete && deleteGraph(graphToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
