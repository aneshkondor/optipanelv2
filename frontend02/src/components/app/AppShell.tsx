import { useState } from 'react';
import {
  LayoutDashboard,
  Search,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  GitBranch,
  Workflow,
  Bell,
  BookOpen,
  Database,
  Settings,
  Menu,
  ChevronLeft,
  Filter,
  Calendar,
  Globe,
  Layers,
  CreditCard,
  Target,
  X,
  Phone,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ThemeToggle } from '../ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { toast } from 'sonner';

type Route =
  | 'dashboard'
  | 'explore'
  | 'funnels'
  | 'cohorts'
  | 'retention'
  | 'revenue'
  | 'experiments'
  | 'flows'
  | 'alerts'
  | 'reports'
  | 'catalog'
  | 'engagement'
  | 'livemetrics'
  | 'settings'
  | 'aichat';

interface AppShellProps {
  children: React.ReactNode;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}

export function AppShell({ children, currentRoute, onNavigate }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', route: 'dashboard' as Route },
    { icon: <Sparkles className="h-5 w-5" />, label: 'OptiPanel AI', route: 'aichat' as Route },
    { icon: <Search className="h-5 w-5" />, label: 'Explore', route: 'explore' as Route },
    { icon: <TrendingUp className="h-5 w-5" />, label: 'Funnels', route: 'funnels' as Route },
    { icon: <Users className="h-5 w-5" />, label: 'Cohorts', route: 'cohorts' as Route },
    { icon: <Activity className="h-5 w-5" />, label: 'Retention', route: 'retention' as Route },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Revenue & P/L', route: 'revenue' as Route },
    { icon: <GitBranch className="h-5 w-5" />, label: 'Experiments', route: 'experiments' as Route },
    { icon: <Workflow className="h-5 w-5" />, label: 'User Flows', route: 'flows' as Route },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Live Metrics', route: 'livemetrics' as Route },
    { icon: <Phone className="h-5 w-5" />, label: 'AI Engagement', route: 'engagement' as Route, badge: 2 },
    { icon: <Bell className="h-5 w-5" />, label: 'Alerts', route: 'alerts' as Route, badge: 3 },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Reports', route: 'reports' as Route },
    { icon: <Database className="h-5 w-5" />, label: 'Data Catalog', route: 'catalog' as Route },
  ];

  const handleNavClick = (route: Route) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Check if query starts with "/"
      if (searchQuery.trim().startsWith('/')) {
        // Extract query after "/"
        const aiQuery = searchQuery.trim().substring(1).trim();
        if (aiQuery) {
          // Store in sessionStorage for AI Chat to pick up
          sessionStorage.setItem('aiChatQuery', aiQuery);
          // Show toast notification
          toast.success('Opening OptiPanel AI...', {
            description: `"${aiQuery}"`,
          });
          // Navigate to AI Chat
          onNavigate('aichat');
          // Clear search
          setSearchQuery('');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold hidden sm:inline">ProductName</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchSubmit}
                placeholder="Search metrics, reports... (Type / for AI)"
                className="pl-10 rounded-xl"
              />
              {searchQuery.startsWith('/') && searchQuery.length > 1 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-primary">Ask AI</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => onNavigate('alerts')}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@company.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Documentation
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Global Filters */}
        <div className="border-t border-border">
          <div className="flex items-center gap-3 px-4 lg:px-6 py-3 overflow-x-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <div className="h-4 w-px bg-border" />

            {/* Date Range */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] h-9">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            {/* Product Filter */}
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-9">
                <Layers className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="pro">Pro Plan</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>

            {/* Region Filter */}
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-9">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
                <SelectItem value="apac">APAC</SelectItem>
              </SelectContent>
            </Select>

            {/* Channel Filter */}
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-9">
                <Target className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-4 w-px bg-border" />

            <Button variant="ghost" size="sm">
              Save View
            </Button>
            <Button variant="ghost" size="sm">
              Share
            </Button>
            <Button variant="ghost" size="sm">
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside
          className={`hidden lg:block border-r border-border bg-card transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-16'
          }`}
        >
          <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col">
            {/* Toggle */}
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-8 w-8"
              >
                <ChevronLeft
                  className={`h-4 w-4 transition-transform ${
                    sidebarOpen ? '' : 'rotate-180'
                  }`}
                />
              </Button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    currentRoute === item.route
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {item.badge !== undefined && (
                        <Badge variant="secondary" className="h-5 min-w-5 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              ))}
            </nav>

            {/* Settings */}
            <div className="p-2 border-t border-border">
              <button
                onClick={() => handleNavClick('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                  currentRoute === 'settings'
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
                {sidebarOpen && <span className="text-sm">Settings</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-semibold">ProductName</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="p-2 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.route}
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                      currentRoute === item.route
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge !== undefined && (
                      <Badge variant="secondary">{item.badge}</Badge>
                    )}
                  </button>
                ))}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-border">
                <button
                  onClick={() => handleNavClick('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    currentRoute === 'settings'
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 lg:p-6 max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
