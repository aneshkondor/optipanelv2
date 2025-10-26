import { useState } from 'react';
import { Play, Save, Sparkles, Plus, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FloatingChat } from './FloatingChat';
import { toast } from 'sonner';

interface ExplorePageProps {
  onNavigate?: (route: 'aichat') => void;
}

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  const [metrics, setMetrics] = useState(['revenue']);
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [aiQuery, setAiQuery] = useState('');

  const mockData = [
    { date: 'Jan', value: 45000 },
    { date: 'Feb', value: 52000 },
    { date: 'Mar', value: 48000 },
    { date: 'Apr', value: 61000 },
    { date: 'May', value: 55000 },
    { date: 'Jun', value: 67000 },
  ];

  const handleAskAI = () => {
    if (!aiQuery.trim()) {
      toast.error('Please enter a question');
      return;
    }

    // Store the query in sessionStorage so AIChatPanel can pick it up
    sessionStorage.setItem('aiChatQuery', aiQuery.trim());
    
    // Show success message
    toast.success('Opening AI Chat...', {
      description: `"${aiQuery.trim()}"`,
    });
    
    // Navigate to AI Chat
    if (onNavigate) {
      onNavigate('aichat');
    } else {
      // Fallback to hash navigation
      window.location.hash = 'aichat';
    }
    
    // Clear the query
    setAiQuery('');
  };

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="text-muted-foreground mt-1">
            Build custom queries and discover insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save as Metric
          </Button>
          <Button className="gap-2 rounded-xl">
            <Play className="h-4 w-4" />
            Run Query
          </Button>
        </div>
      </div>

      {/* Query Builder */}
      <Card className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Metrics */}
          <div className="space-y-3">
            <Label>Metrics</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="users">Active Users</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
                <SelectItem value="mrr">MRR</SelectItem>
                <SelectItem value="ltv">LTV</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {metrics.map((metric) => (
                <Badge key={metric} variant="secondary" className="gap-2">
                  {metric}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setMetrics(metrics.filter(m => m !== metric))} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-3">
            <Label>Group By</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Add dimension" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="channel">Channel</SelectItem>
                <SelectItem value="region">Region</SelectItem>
                <SelectItem value="plan">Plan</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {dimensions.map((dim) => (
                <Badge key={dim} variant="outline" className="gap-2">
                  {dim}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDimensions(dimensions.filter(d => d !== dim))} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Aggregation */}
          <div className="space-y-3">
            <Label>Aggregation</Label>
            <Select defaultValue="sum">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sum">Sum</SelectItem>
                <SelectItem value="avg">Average</SelectItem>
                <SelectItem value="count">Count</SelectItem>
                <SelectItem value="unique">Unique Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Query */}
        <div className="mt-6 pt-6 border-t border-border bg-gradient-to-br from-primary/5 to-transparent rounded-lg p-4 -mx-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Ask AI</Label>
              <p className="text-xs text-muted-foreground">
                Get instant insights from your data
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && aiQuery.trim()) {
                    handleAskAI();
                  }
                }}
                placeholder="e.g., Why did revenue spike last week?"
                className="flex-1 pr-20 bg-background"
              />
              {aiQuery.trim() && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                    Press Enter
                  </Badge>
                </div>
              )}
            </div>
            <Button 
              onClick={handleAskAI}
              disabled={!aiQuery.trim()}
              className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Sparkles className="h-4 w-4" />
              Ask AI
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Try:</span>
            {[
              'Why did revenue spike?',
              'Show conversion trends',
              'Compare regions',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setAiQuery(suggestion)}
                className="text-xs px-2 py-1 rounded-md bg-background hover:bg-muted border border-border hover:border-primary/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results */}
      <Card className="p-6">
        <Tabs defaultValue="chart">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="sql">SQL</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm">
              Export
            </Button>
          </div>

          <TabsContent value="chart">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-1))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="table">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-right p-3 font-medium">Revenue</th>
                    <th className="text-right p-3 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-3">{row.date}</td>
                      <td className="p-3 text-right">${row.value.toLocaleString()}</td>
                      <td className="p-3 text-right text-success">
                        {i > 0 ? `+${(((row.value - mockData[i-1].value) / mockData[i-1].value) * 100).toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="sql">
            <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
              <pre>
{`SELECT 
  date_trunc('month', created_at) as month,
  SUM(revenue) as total_revenue
FROM transactions
WHERE created_at >= '2024-01-01'
GROUP BY 1
ORDER BY 1 DESC`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      </div>
      <FloatingChat />
    </>
  );
}
