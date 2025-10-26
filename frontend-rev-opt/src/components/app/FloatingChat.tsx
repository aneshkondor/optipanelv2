import { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');

  const sampleData = [
    { region: 'NA', revenue: 1250 },
    { region: 'EU', revenue: 890 },
    { region: 'APAC', revenue: 650 },
    { region: 'LATAM', revenue: 320 },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setInput('');
    // In a real implementation, this would send to the AI
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow relative"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-success rounded-full flex items-center justify-center text-xs">
                <Sparkles className="h-3 w-3" />
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card 
              className="w-[380px] shadow-2xl overflow-hidden border-border"
              style={{
                height: isMinimized ? 'auto' : '600px',
                backgroundColor: 'hsl(var(--card) / 0.95)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">AI Assistant</p>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: '440px' }}>
                    {/* AI Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground">AI</span>
                        </div>
                        <div className="rounded-2xl rounded-tl-md p-3 bg-muted/50 border border-border">
                          <p className="text-sm">
                            Hello! I can help you analyze your data. What would you like to know?
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* User Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[85%]">
                        <div className="flex items-center gap-2 mb-2 justify-end">
                          <span className="text-xs text-muted-foreground">You</span>
                        </div>
                        <div className="rounded-2xl rounded-tr-md p-3 bg-primary text-primary-foreground">
                          <p className="text-sm">
                            Show me revenue by region for the last quarter
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* AI Response with Chart */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground">AI</span>
                        </div>
                        <div className="rounded-2xl rounded-tl-md p-3 bg-muted/50 border border-border">
                          <p className="text-sm mb-3">
                            Here's your regional revenue breakdown:
                          </p>
                          <div className="bg-card/50 rounded-xl p-3 border border-border">
                            <div style={{ width: '100%', height: 140 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sampleData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                  <XAxis
                                    dataKey="region"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={10}
                                    tickLine={false}
                                  />
                                  <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={10}
                                    tickLine={false}
                                    tickFormatter={(value) => `$${value}k`}
                                  />
                                  <Bar dataKey="revenue" fill="rgb(110, 86, 207)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            North America leads with $1.25M, up 12% QoQ.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-border bg-card/50">
                    <div className="flex items-center gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className="flex-1 rounded-xl text-sm h-10"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        size="icon"
                        className="h-10 w-10 rounded-xl flex-shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
