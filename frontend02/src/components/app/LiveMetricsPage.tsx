import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  BarChart3,
  Circle,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Pause,
  Package,
  Truck,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useMetrics } from '../../contexts/MetricsContext';
import { metricsService } from '../../services/metricsService';

export function LiveMetricsPage() {
  const {
    aggregatedMetrics,
    userMetrics,
    timeSeriesData,
    recentEvents,
    featureUsage,
    isConnected,
  } = useMetrics();

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [demoMode, setDemoMode] = useState(false);
  const [demoInterval, setDemoInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Demo mode: Generate mock data
  const toggleDemoMode = () => {
    if (!demoMode) {
      // Start demo mode
      const features = ['Browsing', 'Searching', 'Cart', 'Checkout', 'Order Tracking', 'Delivery'];
      const actions = ['Added item to cart', 'Searched for products', 'Viewed product', 'Applied coupon', 'Started checkout', 'Scheduled delivery'];
      const locations = ['San Francisco, CA', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Austin, TX'];
      const memberTypes = ['Free', 'Premium', 'Premium+'];
      
      // Generate initial users (shoppers)
      const mockUsers = Array.from({ length: 15 }, (_, i) => ({
        userId: `shopper_${i + 1}`,
        userName: `Shopper ${i + 1}`,
        email: `shopper${i + 1}@instacart.com`,
        company: locations[i % locations.length],
        timestamp: new Date().toISOString(),
        sessionDuration: Math.floor(Math.random() * 45) + 5,
        pageViews: Math.floor(Math.random() * 30) + 1,
        clickCount: Math.floor(Math.random() * 80) + 10,
        scrollDepth: Math.floor(Math.random() * 100),
        featuresUsed: features.slice(0, Math.floor(Math.random() * features.length) + 1),
        activeFeature: features[Math.floor(Math.random() * features.length)],
        featureTime: Object.fromEntries(features.map(f => [f, Math.floor(Math.random() * 30)])),
        eventsTriggered: Math.floor(Math.random() * 25),
        // E-commerce specific data
        cartValue: parseFloat((Math.random() * 200 + 20).toFixed(2)),
        itemsInCart: Math.floor(Math.random() * 20) + 1,
        productsViewed: Math.floor(Math.random() * 40) + 5,
        searchesPerformed: Math.floor(Math.random() * 8) + 1,
        couponsApplied: Math.floor(Math.random() * 3),
        membershipType: memberTypes[i % memberTypes.length],
        deliveryWindow: Math.random() > 0.5 ? 'Today' : 'Tomorrow',
        isActive: Math.random() > 0.3,
        lastAction: actions[Math.floor(Math.random() * actions.length)],
        lastActionTime: new Date().toISOString(),
        queriesRun: Math.floor(Math.random() * 8),
        reportsCreated: Math.floor(Math.random() * 2),
        dashboardsViewed: Math.floor(Math.random() * 5),
      }));

      metricsService.pushBulkMetrics(mockUsers);

      // Update metrics every 3 seconds
      const interval = setInterval(() => {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        randomUser.timestamp = new Date().toISOString();
        randomUser.pageViews++;
        randomUser.eventsTriggered++;
        randomUser.sessionDuration++;
        randomUser.activeFeature = features[Math.floor(Math.random() * features.length)];
        randomUser.lastAction = actions[Math.floor(Math.random() * actions.length)];
        
        // Randomly update cart data
        if (Math.random() > 0.6) {
          randomUser.itemsInCart += Math.random() > 0.5 ? 1 : -1;
          randomUser.itemsInCart = Math.max(0, randomUser.itemsInCart);
          randomUser.cartValue = parseFloat((randomUser.itemsInCart * (Math.random() * 15 + 5)).toFixed(2));
        }
        
        metricsService.pushUserMetric(randomUser);
      }, 3000);

      setDemoInterval(interval);
      setDemoMode(true);
    } else {
      // Stop demo mode
      if (demoInterval) {
        clearInterval(demoInterval);
        setDemoInterval(null);
      }
      metricsService.clearMetrics();
      setDemoMode(false);
    }
  };

  // Calculate time since last update
  const secondsSinceUpdate = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);

  // Prepare chart data
  const activityChartData = timeSeriesData.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    users: point.activeUsers,
    events: point.totalEvents,
    engagement: point.avgEngagement,
  }));

  const featureChartData = featureUsage.map(f => ({
    name: f.featureName,
    usage: f.totalUsage,
    users: f.uniqueUsers,
  }));

  const COLORS = ['#6E56CF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Live Shopper Metrics</h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of shopper activity, cart behavior, and conversions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleDemoMode}
            variant={demoMode ? 'default' : 'outline'}
            size="sm"
          >
            {demoMode ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Demo
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Demo
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Circle
              className={`h-2 w-2 ${
                isConnected || demoMode ? 'fill-success text-success' : 'fill-destructive text-destructive'
              } animate-pulse`}
            />
            <span className="text-sm text-muted-foreground">
              {demoMode ? 'Demo Mode' : isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Updated {secondsSinceUpdate}s ago
          </Badge>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="h-5 w-5" />}
          label="Active Shoppers"
          value={aggregatedMetrics?.activeUsers || 0}
          change={8}
          changeLabel="vs last hour"
          color="success"
        />
        <MetricCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Active Carts"
          value={Math.floor((aggregatedMetrics?.activeUsers || 0) * 0.7)}
          change={12}
          changeLabel="vs last hour"
        />
        <MetricCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Cart Value"
          value={Math.floor((aggregatedMetrics?.totalUsers || 0) * 87.5)}
          change={-3}
          changeLabel="vs last hour"
          color="warning"
        />
        <MetricCard
          icon={<Package className="h-5 w-5" />}
          label="Orders/Hour"
          value={Math.floor((aggregatedMetrics?.totalEvents || 0) / 12)}
          change={15}
          changeLabel="vs last hour"
          color="info"
        />
      </div>

      <Tabs defaultValue="realtime" className="w-full">
        <TabsList>
          <TabsTrigger value="realtime">Real-time Activity</TabsTrigger>
          <TabsTrigger value="users">Shopper Details</TabsTrigger>
          <TabsTrigger value="features">Shopping Behavior</TabsTrigger>
          <TabsTrigger value="events">Event Stream</TabsTrigger>
        </TabsList>

        {/* Real-time Activity Tab */}
        <TabsContent value="realtime" className="space-y-6 mt-6">
          {/* Activity Timeline */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Active Shoppers Over Time</h3>
              <Badge variant="secondary">{aggregatedMetrics?.activeUsers} shopping now</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityChartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(110, 86, 207)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(110, 86, 207)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(255 255 255 / 0.1)" />
                  <XAxis dataKey="time" stroke="rgb(255 255 255 / 0.5)" />
                  <YAxis stroke="rgb(255 255 255 / 0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(0 0 0 / 0.8)',
                      border: '1px solid rgb(255 255 255 / 0.1)',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(value) => `Time: ${value}`}
                    formatter={(value: number) => [`${value} shoppers`, 'Active Shoppers']}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="rgb(110, 86, 207)"
                    strokeWidth={3}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Events & Engagement */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Cart Actions (Add/Remove)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(255 255 255 / 0.1)" />
                    <XAxis dataKey="time" stroke="rgb(255 255 255 / 0.5)" />
                    <YAxis stroke="rgb(255 255 255 / 0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(0 0 0 / 0.8)',
                        border: '1px solid rgb(255 255 255 / 0.1)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value} actions`, 'Cart Events']}
                    />
                    <Line
                      type="monotone"
                      dataKey="events"
                      stroke="rgb(16, 185, 129)"
                      strokeWidth={3}
                      dot={{ fill: 'rgb(16, 185, 129)', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Avg Shopping Session (min)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityChartData}>
                    <defs>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(245, 158, 11)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="rgb(245, 158, 11)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(255 255 255 / 0.1)" />
                    <XAxis dataKey="time" stroke="rgb(255 255 255 / 0.5)" />
                    <YAxis stroke="rgb(255 255 255 / 0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(0 0 0 / 0.8)',
                        border: '1px solid rgb(255 255 255 / 0.1)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value} min`, 'Session Length']}
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stroke="rgb(245, 158, 11)"
                      strokeWidth={3}
                      fill="url(#colorEngagement)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Top Shopping Activities */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Top Shopping Activities</h3>
            <div className="grid md:grid-cols-5 gap-4">
              {aggregatedMetrics?.topFeatures.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted/30 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-primary">{feature.usage}</div>
                  <div className="text-xs text-muted-foreground mt-1">{feature.name}</div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* E-commerce KPIs */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Average Cart Value</h3>
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div className="text-3xl font-bold text-success">
                ${userMetrics.length > 0 
                  ? (userMetrics.reduce((sum, u) => sum + ((u as any).cartValue || 0), 0) / userMetrics.length).toFixed(2)
                  : '0.00'}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Across {userMetrics.filter(u => (u as any).itemsInCart > 0).length} active carts
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Items per Cart</h3>
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">
                {userMetrics.length > 0
                  ? (userMetrics.reduce((sum, u) => sum + ((u as any).itemsInCart || 0), 0) / 
                     Math.max(userMetrics.filter(u => (u as any).itemsInCart > 0).length, 1)).toFixed(1)
                  : '0.0'}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Average items per active cart
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Conversion Rate</h3>
                <Truck className="h-5 w-5 text-info" />
              </div>
              <div className="text-3xl font-bold text-info">
                {aggregatedMetrics?.activeUsers 
                  ? ((Math.floor((aggregatedMetrics.totalEvents || 0) / 12) / aggregatedMetrics.activeUsers) * 100).toFixed(1)
                  : '0.0'}%
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Shoppers completing checkout
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* Shopper Details Tab */}
        <TabsContent value="users" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Active Shoppers ({userMetrics.length})</h3>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {userMetrics.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-semibold text-sm">
                            {user.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {user.isActive && (
                          <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-success text-success" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-xs text-muted-foreground">{user.company}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{user.sessionDuration}m</div>
                        <div className="text-xs text-muted-foreground">Session</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">${(user as any).cartValue || 0}</div>
                        <div className="text-xs text-muted-foreground">Cart</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{(user as any).itemsInCart || 0}</div>
                        <div className="text-xs text-muted-foreground">Items</div>
                      </div>
                      <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
                        {user.activeFeature}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Shopping Behavior Tab */}
        <TabsContent value="features" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Shopping Activity Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={featureChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="usage"
                    >
                      {featureChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(0 0 0 / 0.8)',
                        border: '1px solid rgb(255 255 255 / 0.1)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Activity Engagement</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(255 255 255 / 0.1)" />
                    <XAxis dataKey="name" stroke="rgb(255 255 255 / 0.5)" />
                    <YAxis stroke="rgb(255 255 255 / 0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(0 0 0 / 0.8)',
                        border: '1px solid rgb(255 255 255 / 0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="users" fill="rgb(110, 86, 207)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Shopping Activity Details</h3>
            <div className="space-y-3">
              {featureUsage.map((feature, index) => (
                <motion.div
                  key={feature.featureName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{feature.featureName}</div>
                      <div className="text-xs text-muted-foreground">
                        {feature.uniqueUsers} unique shoppers • {feature.avgDuration.toFixed(1)}m avg
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{feature.totalUsage}</div>
                      <div className="text-xs text-muted-foreground">Total actions</div>
                    </div>
                    <TrendIcon trend={feature.trend} />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Event Stream Tab */}
        <TabsContent value="events" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Live Shopping Event Stream</h3>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {recentEvents.map((event, index) => {
                  // Map event types to shopping-specific badges
                  const eventTypeMap: Record<string, string> = {
                    'page_view': 'Product View',
                    'click': 'Clicked',
                    'feature_used': 'Action',
                    'query_run': 'Search',
                  };
                  
                  return (
                    <motion.div
                      key={`${event.timestamp}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg text-sm"
                    >
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                      <span className="text-muted-foreground min-w-20">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {eventTypeMap[event.type] || event.type.replace('_', ' ')}
                      </Badge>
                      <span className="font-medium">{event.userName}</span>
                      <span className="text-muted-foreground">
                        {event.data?.feature || event.data?.action || 'Browsing'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'info';
}

function MetricCard({ icon, label, value, change, changeLabel, color = 'primary' }: MetricCardProps) {
  const colorClass = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  }[color];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={colorClass}>{icon}</div>
          {change !== undefined && <ChangeBadge change={change} label={changeLabel} />}
        </div>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
      </Card>
    </motion.div>
  );
}

function ChangeBadge({ change, label }: { change: number; label?: string }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="flex items-center gap-1 text-xs">
      {isNeutral ? (
        <Minus className="h-3 w-3 text-muted-foreground" />
      ) : isPositive ? (
        <ArrowUp className="h-3 w-3 text-success" />
      ) : (
        <ArrowDown className="h-3 w-3 text-destructive" />
      )}
      <span className={isNeutral ? 'text-muted-foreground' : isPositive ? 'text-success' : 'text-destructive'}>
        {Math.abs(change)}%
      </span>
      {label && <span className="text-muted-foreground ml-1">{label}</span>}
    </div>
  );
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? ArrowDown : Minus;
  const color =
    trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return <Icon className={`h-5 w-5 ${color}`} />;
}
