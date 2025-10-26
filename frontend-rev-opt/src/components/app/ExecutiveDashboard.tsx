import { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Activity,
  X,
  Plus,
  Check,
  BarChart3 as BarChart,
  GripVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FloatingChat } from './FloatingChat';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface DashboardWidget {
  id: string;
  type: 'chart';
  title: string;
  chart: {
    type: 'line' | 'bar' | 'area';
    data: any[];
    dataKeys: string[];
  };
  order: number;
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

const ITEM_TYPE = 'WIDGET';

interface DraggableWidgetProps {
  widget: DashboardWidget;
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  isEditMode: boolean;
  onRemove: (id: string) => void;
  children: React.ReactNode;
}

function DraggableWidget({ widget, index, moveWidget, isEditMode, onRemove, children }: DraggableWidgetProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    canDrag: isEditMode,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveWidget(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        if (isEditMode) {
          drag(drop(node));
        }
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`relative ${isOver && isEditMode ? 'ring-2 ring-primary' : ''}`}
    >
      {children}
    </div>
  );
}

export function ExecutiveDashboard() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [savedGraphs, setSavedGraphs] = useState<SavedGraph[]>([]);
  const [showAddGraphs, setShowAddGraphs] = useState(false);

  const kpis = [
    {
      label: 'Revenue',
      value: '$2,847,231',
      change: '+12.3%',
      trend: 'up',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-success',
    },
    {
      label: 'Gross Margin',
      value: '68.4%',
      change: '+2.1%',
      trend: 'up',
      icon: <Target className="h-5 w-5" />,
      color: 'text-primary',
    },
    {
      label: 'CAC',
      value: '$892',
      change: '−8.7%',
      trend: 'down',
      icon: <Users className="h-5 w-5" />,
      color: 'text-info',
    },
    {
      label: 'LTV',
      value: '$14,500',
      change: '+15.2%',
      trend: 'up',
      icon: <Activity className="h-5 w-5" />,
      color: 'text-warning',
    },
    {
      label: 'MRR',
      value: '$284,500',
      change: '+9.4%',
      trend: 'up',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-success',
    },
    {
      label: 'NRR',
      value: '124%',
      change: '+3.8%',
      trend: 'up',
      icon: <Target className="h-5 w-5" />,
      color: 'text-primary',
    },
  ];

  // Load widgets and saved graphs from localStorage
  useEffect(() => {
    const storedGraphs = localStorage.getItem('savedGraphs');
    if (storedGraphs) {
      setSavedGraphs(JSON.parse(storedGraphs));
    }

    const storedWidgets = localStorage.getItem('dashboardWidgets');
    if (storedWidgets) {
      try {
        const parsed = JSON.parse(storedWidgets);
        // Add order property if missing and sort
        const withOrder = parsed.map((w: any, i: number) => ({
          ...w,
          order: w.order ?? i,
        }));
        setWidgets(withOrder.sort((a: DashboardWidget, b: DashboardWidget) => a.order - b.order));
      } catch (e) {
        setWidgets([]);
      }
    }
  }, []);

  // Sync saved graphs whenever they change
  useEffect(() => {
    const handleStorageChange = () => {
      const storedGraphs = localStorage.getItem('savedGraphs');
      if (storedGraphs) {
        setSavedGraphs(JSON.parse(storedGraphs));
      }
      
      const storedWidgets = localStorage.getItem('dashboardWidgets');
      if (storedWidgets) {
        try {
          const parsed = JSON.parse(storedWidgets);
          const withOrder = parsed.map((w: any, i: number) => ({
            ...w,
            order: w.order ?? i,
          }));
          setWidgets(withOrder.sort((a: DashboardWidget, b: DashboardWidget) => a.order - b.order));
        } catch (e) {
          setWidgets([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Poll for changes every second
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    const draggedWidget = widgets[dragIndex];
    const newWidgets = [...widgets];
    newWidgets.splice(dragIndex, 1);
    newWidgets.splice(hoverIndex, 0, draggedWidget);
    
    // Update order property
    const withNewOrder = newWidgets.map((w, i) => ({ ...w, order: i }));
    setWidgets(withNewOrder);
    localStorage.setItem('dashboardWidgets', JSON.stringify(withNewOrder));
  };

  const removeWidget = (widgetId: string) => {
    const updated = widgets.filter(w => w.id !== widgetId);
    // Reindex order
    const reindexed = updated.map((w, i) => ({ ...w, order: i }));
    setWidgets(reindexed);
    localStorage.setItem('dashboardWidgets', JSON.stringify(reindexed));
    toast.success('Widget removed from dashboard');
  };

  const addGraphToDashboard = (graph: SavedGraph) => {
    // Check if already exists
    if (widgets.find(w => w.id === graph.id)) {
      toast.error('This graph is already on the dashboard');
      return;
    }

    const newWidget: DashboardWidget = {
      id: graph.id,
      type: 'chart',
      title: graph.title,
      chart: graph.chart,
      order: widgets.length,
    };

    const updated = [...widgets, newWidget];
    setWidgets(updated);
    localStorage.setItem('dashboardWidgets', JSON.stringify(updated));
    toast.success('Graph added to dashboard!');
  };

  const handleEnterEditMode = () => {
    setIsEditMode(true);
    toast.success('Edit mode activated');
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
    toast.success('Dashboard customization saved!');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = (widget: DashboardWidget) => {
    const ChartComponent = widget.chart.type === 'line' ? LineChart : widget.chart.type === 'area' ? AreaChart : ReBarChart;
    const DataComponent = widget.chart.type === 'line' ? Line : widget.chart.type === 'area' ? Area : Bar;
    
    return (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={widget.chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {widget.chart.type === 'area' && (
              <defs>
                <linearGradient id={`gradient-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(110, 86, 207)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="rgb(110, 86, 207)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            )}
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey={Object.keys(widget.chart.data[0])[0]}
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} iconType="line" />
            {widget.chart.dataKeys.map((key, index) => (
              <DataComponent
                key={key}
                type="monotone"
                dataKey={key}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
                stroke={index === 0 ? 'rgb(110, 86, 207)' : '#8B5CF6'}
                fill={widget.chart.type === 'area' ? `url(#gradient-${widget.id})` : index === 0 ? 'rgb(110, 86, 207)' : '#8B5CF6'}
                fillOpacity={widget.chart.type === 'area' ? 1 : 0.8}
                strokeWidth={widget.chart.type === 'line' ? 2 : 0}
                animationDuration={1000}
              />
            ))}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  };

  const unusedGraphs = savedGraphs.filter(graph => !widgets.find(w => w.id === graph.id));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6 pb-20">
        {/* Edit Mode Banner */}
        <AnimatePresence>
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <div>
                  <p className="font-medium text-primary">Edit Mode Active</p>
                  <p className="text-sm text-muted-foreground">Drag to reorder • Click X to remove • Click Add to insert new graphs</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Executive Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Real-time revenue analytics and key metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">
              Export Report
            </Button>
            {!isEditMode ? (
              <Button 
                variant="outline" 
                className="rounded-xl gap-2"
                onClick={handleEnterEditMode}
              >
                Customize
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="rounded-xl gap-2"
                  onClick={() => setShowAddGraphs(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
                <Button 
                  className="rounded-xl gap-2 bg-primary hover:bg-primary/90"
                  onClick={handleExitEditMode}
                >
                  <Check className="h-4 w-4" />
                  Done
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-8 w-8 rounded-lg bg-muted flex items-center justify-center ${kpi.color}`}>
                    {kpi.icon}
                  </div>
                  <Badge
                    variant="secondary"
                    className={kpi.trend === 'up' ? 'bg-success/10 text-success' : 'bg-success/10 text-success'}
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{kpi.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Widgets */}
        {widgets.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {widgets.map((widget, index) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  index={index}
                  moveWidget={moveWidget}
                  isEditMode={isEditMode}
                  onRemove={removeWidget}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotate: isEditMode ? [0, -1, 1, -1, 0] : 0,
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.1,
                      rotate: {
                        repeat: isEditMode ? Infinity : 0,
                        duration: 0.5,
                        ease: "easeInOut",
                      }
                    }}
                    layout
                    className={isEditMode ? 'cursor-move' : ''}
                  >
                    <Card className={`p-6 relative group ${isEditMode ? 'hover:shadow-xl hover:border-primary/50 transition-all' : ''}`}>
                      {isEditMode && (
                        <>
                          <div className="absolute top-4 left-4 opacity-60 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg z-10 opacity-100"
                            onClick={() => removeWidget(widget.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <div className="flex items-center justify-between mb-6">
                        <div className={isEditMode ? 'ml-8' : ''}>
                          <h3 className="font-semibold">{widget.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Analytics overview
                          </p>
                        </div>
                      </div>
                      {renderChart(widget)}
                    </Card>
                  </motion.div>
                </DraggableWidget>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No graphs on dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add charts from Saved Graphs in AI Chat to customize your dashboard
            </p>
            <Button onClick={handleEnterEditMode}>
              Customize Dashboard
            </Button>
          </Card>
        )}
      </div>

      {/* Floating Chat */}
      <FloatingChat />

      {/* Add Graphs Modal */}
      <Dialog open={showAddGraphs} onOpenChange={setShowAddGraphs}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Graphs to Dashboard</DialogTitle>
            <DialogDescription>
              Select from your saved graphs to add to the dashboard
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {unusedGraphs.length === 0 ? (
              <div className="text-center py-12">
                <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No available graphs</p>
                <p className="text-sm text-muted-foreground mt-2">
                  All saved graphs are already on your dashboard, or you haven't saved any graphs yet
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                {unusedGraphs.map((graph, index) => (
                  <motion.div
                    key={graph.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="p-4 hover:shadow-lg transition-all cursor-pointer border-border hover:border-primary/50 group"
                      onClick={() => {
                        addGraphToDashboard(graph);
                        setShowAddGraphs(false);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BarChart className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {graph.type}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        {graph.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{graph.date}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          addGraphToDashboard(graph);
                          setShowAddGraphs(false);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                        Add to Dashboard
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DndProvider>
  );
}
