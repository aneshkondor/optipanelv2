import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingDown,
  Phone,
  AlertCircle,
  Users,
  Activity,
  Clock,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Loader2,
  BarChart3,
  Calendar,
  Target,
  Zap,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { formatEngagementDataForAI, generateAICallPrompt } from './utils/aiDataFormatter';

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  signupDate: string;
  lastActive: string;
  engagementScore: number;
  previousScore: number;
  status: 'critical' | 'warning' | 'stable' | 'healthy';
  metrics: {
    dailyActiveUse: number;
    weeklyActiveUse: number;
    monthlyActiveUse: number;
    featureAdoption: number;
    dataQuality: number;
    teamCollaboration: number;
  };
  recentActivity: {
    date: string;
    action: string;
    duration: number;
  }[];
  engagementTrend: {
    date: string;
    score: number;
  }[];
  dropoffReason?: string;
}

export function EngagementMonitor() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'usr_001',
      name: 'Sarah Chen',
      email: 'sarah@techflow.com',
      company: 'TechFlow',
      plan: 'Enterprise',
      signupDate: '2024-09-15',
      lastActive: '2024-10-20',
      engagementScore: 32,
      previousScore: 87,
      status: 'critical',
      metrics: {
        dailyActiveUse: 15,
        weeklyActiveUse: 25,
        monthlyActiveUse: 40,
        featureAdoption: 35,
        dataQuality: 60,
        teamCollaboration: 20,
      },
      recentActivity: [
        { date: '2024-10-20', action: 'Viewed Dashboard', duration: 5 },
        { date: '2024-10-18', action: 'Created Report', duration: 12 },
        { date: '2024-10-15', action: 'Viewed Funnel', duration: 3 },
      ],
      engagementTrend: [
        { date: 'Oct 1', score: 85 },
        { date: 'Oct 5', score: 82 },
        { date: 'Oct 10', score: 75 },
        { date: 'Oct 15', score: 60 },
        { date: 'Oct 20', score: 45 },
        { date: 'Oct 25', score: 32 },
      ],
      dropoffReason: 'Decreased login frequency, no team collaboration, limited feature usage',
    },
    {
      id: 'usr_002',
      name: 'Michael Rodriguez',
      email: 'michael@growthlabs.io',
      company: 'GrowthLabs',
      plan: 'Professional',
      signupDate: '2024-08-01',
      lastActive: '2024-10-24',
      engagementScore: 58,
      previousScore: 78,
      status: 'warning',
      metrics: {
        dailyActiveUse: 40,
        weeklyActiveUse: 55,
        monthlyActiveUse: 65,
        featureAdoption: 55,
        dataQuality: 70,
        teamCollaboration: 45,
      },
      recentActivity: [
        { date: '2024-10-24', action: 'Ran Experiment', duration: 25 },
        { date: '2024-10-23', action: 'Analyzed Cohorts', duration: 18 },
        { date: '2024-10-22', action: 'Viewed Dashboard', duration: 8 },
      ],
      engagementTrend: [
        { date: 'Oct 1', score: 78 },
        { date: 'Oct 5', score: 76 },
        { date: 'Oct 10', score: 72 },
        { date: 'Oct 15', score: 68 },
        { date: 'Oct 20', score: 62 },
        { date: 'Oct 25', score: 58 },
      ],
      dropoffReason: 'Gradual decline in feature exploration, sticking to basic features only',
    },
    {
      id: 'usr_003',
      name: 'Emily Watson',
      email: 'emily@cloudscale.com',
      company: 'CloudScale',
      plan: 'Enterprise',
      signupDate: '2024-07-10',
      lastActive: '2024-10-26',
      engagementScore: 92,
      previousScore: 89,
      status: 'healthy',
      metrics: {
        dailyActiveUse: 95,
        weeklyActiveUse: 92,
        monthlyActiveUse: 90,
        featureAdoption: 88,
        dataQuality: 95,
        teamCollaboration: 90,
      },
      recentActivity: [
        { date: '2024-10-26', action: 'Revenue Analysis', duration: 45 },
        { date: '2024-10-26', action: 'Team Meeting', duration: 30 },
        { date: '2024-10-25', action: 'Created Dashboard', duration: 35 },
      ],
      engagementTrend: [
        { date: 'Oct 1', score: 89 },
        { date: 'Oct 5', score: 90 },
        { date: 'Oct 10', score: 88 },
        { date: 'Oct 15', score: 91 },
        { date: 'Oct 20', score: 90 },
        { date: 'Oct 25', score: 92 },
      ],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCallingNow, setIsCallingNow] = useState(false);

  const criticalUsers = users.filter((u) => u.status === 'critical');
  const warningUsers = users.filter((u) => u.status === 'warning');

  const handleInitiateOutreach = async (user: User) => {
    setSelectedUser(user);
    setIsAnalyzing(true);
    setShowAIDialog(true);

    // Simulate AI analysis
    setTimeout(() => {
      const formattedData = formatEngagementDataForAI(user);
      const callPrompt = generateAICallPrompt(user);
      
      setAiAnalysis({
        formattedData,
        callPrompt,
        recommendations: [
          'Start with empathy - acknowledge their decreased activity',
          'Ask open-ended questions about their current challenges',
          'Listen for pain points related to: team collaboration, data setup, or feature complexity',
          'Offer specific solutions based on their usage patterns',
          'Schedule a personalized onboarding session if needed',
        ],
        talkingPoints: [
          `${user.name} signed up ${getDaysSince(user.signupDate)} days ago with high initial engagement`,
          `Engagement dropped ${user.previousScore - user.engagementScore} points over the last 3 weeks`,
          `Last active ${getDaysSince(user.lastActive)} days ago with minimal session time`,
          `Primary concern: ${user.dropoffReason}`,
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getDaysSince = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const handleStartCallNow = async (user: User) => {
    console.log('🔥 CALL BUTTON CLICKED! User:', user.name);
    setIsCallingNow(true);

    try {
      console.log('📞 Sending call request to backend...');

      const response = await fetch('http://localhost:3001/api/frontend/analyze-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const result = await response.json();
      console.log('✅ Backend response:', result);

      alert(`Call initiated! ${result.message || 'Check console for details'}`);
    } catch (error: any) {
      console.error('❌ Error calling backend:', error);
      alert(`Error: ${error.message}. Make sure backend is running on port 3001!`);
    } finally {
      setIsCallingNow(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">AI Engagement Monitor</h1>
          <p className="text-muted-foreground mt-1">
            Proactive user retention powered by AI analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="destructive" className="text-sm">
            <AlertCircle className="h-3 w-3 mr-1" />
            {criticalUsers.length} Critical
          </Badge>
          <Badge variant="outline" className="text-sm border-warning text-warning">
            <TrendingDown className="h-3 w-3 mr-1" />
            {warningUsers.length} Warning
          </Badge>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
            <div className="text-2xl font-bold">{criticalUsers.length}</div>
            <div className="text-xs text-muted-foreground">Critical Users</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-warning" />
              <Badge variant="outline" className="text-xs">-15%</Badge>
            </div>
            <div className="text-2xl font-bold">{warningUsers.length}</div>
            <div className="text-xs text-muted-foreground">At Risk</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Phone className="h-5 w-5 text-success" />
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">Outreach Made</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-5 w-5 text-info" />
              <Badge variant="secondary" className="text-xs">85%</Badge>
            </div>
            <div className="text-2xl font-bold">10</div>
            <div className="text-xs text-muted-foreground">Re-engaged</div>
          </Card>
        </motion.div>
      </div>

      {/* Users List */}
      <Tabs defaultValue="critical" className="w-full">
        <TabsList>
          <TabsTrigger value="critical">
            Critical ({criticalUsers.length})
          </TabsTrigger>
          <TabsTrigger value="warning">
            Warning ({warningUsers.length})
          </TabsTrigger>
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="critical" className="space-y-4 mt-6">
          {criticalUsers.map((user, index) => (
            <UserEngagementCard
              key={user.id}
              user={user}
              index={index}
              onInitiateOutreach={handleInitiateOutreach}
            />
          ))}
        </TabsContent>

        <TabsContent value="warning" className="space-y-4 mt-6">
          {warningUsers.map((user, index) => (
            <UserEngagementCard
              key={user.id}
              user={user}
              index={index}
              onInitiateOutreach={handleInitiateOutreach}
            />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {users.map((user, index) => (
            <UserEngagementCard
              key={user.id}
              user={user}
              index={index}
              onInitiateOutreach={handleInitiateOutreach}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* AI Analysis Dialog */}
      <AIAnalysisDialog
        user={selectedUser}
        analysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
        isCallingNow={isCallingNow}
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        onStartCall={handleStartCallNow}
      />
    </div>
  );
}

// User Engagement Card Component
function UserEngagementCard({
  user,
  index,
  onInitiateOutreach,
}: {
  user: User;
  index: number;
  onInitiateOutreach: (user: User) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'border-destructive/50 bg-destructive/5';
      case 'warning':
        return 'border-warning/50 bg-warning/5';
      case 'healthy':
        return 'border-success/50 bg-success/5';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`p-6 border-2 ${getStatusColor(user.status)}`}>
        <div className="grid lg:grid-cols-12 gap-6">
          {/* User Info */}
          <div className="lg:col-span-3">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.company}</p>
                <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
              </div>
              <Badge
                variant={
                  user.status === 'critical'
                    ? 'destructive'
                    : user.status === 'warning'
                    ? 'outline'
                    : 'secondary'
                }
                className={user.status === 'warning' ? 'border-warning text-warning' : ''}
              >
                {user.status}
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Signed up {new Date(user.signupDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last active {new Date(user.lastActive).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-3 w-3" />
                <span>{user.plan} Plan</span>
              </div>
            </div>
          </div>

          {/* Engagement Score */}
          <div className="lg:col-span-2">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Engagement Score</div>
              <div className="relative inline-block">
                <div className="text-4xl font-bold">{user.engagementScore}</div>
                <div className="absolute -right-8 top-0 text-sm text-destructive">
                  -{user.previousScore - user.engagementScore}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                from {user.previousScore}
              </div>
              <Progress value={user.engagementScore} className="mt-3 h-2" />
            </div>
          </div>

          {/* Metrics */}
          <div className="lg:col-span-4">
            <div className="text-sm text-muted-foreground mb-3">Key Metrics</div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(user.metrics).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <Progress value={value} className="h-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div className="text-xs text-muted-foreground mb-2">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              {user.dropoffReason}
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => onInitiateOutreach(user)}
                className="w-full"
                variant={user.status === 'critical' ? 'default' : 'outline'}
              >
                <Phone className="h-4 w-4 mr-2" />
                Initiate AI Outreach
              </Button>
              <Button variant="ghost" className="w-full text-xs">
                <BarChart3 className="h-3 w-3 mr-2" />
                View Full History
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// AI Analysis Dialog Component
function AIAnalysisDialog({
  user,
  analysis,
  isAnalyzing,
  isCallingNow,
  open,
  onOpenChange,
  onStartCall,
}: {
  user: User | null;
  analysis: any;
  isAnalyzing: boolean;
  isCallingNow: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartCall: (user: User) => void;
}) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Outreach Analysis: {user.name}
          </DialogTitle>
          <DialogDescription>
            AI-generated insights and call preparation for re-engagement
          </DialogDescription>
        </DialogHeader>

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing engagement data...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* AI-Formatted Data */}
            <Card className="p-4 bg-muted/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI-Readable Data Summary
              </h3>
              <pre className="text-xs bg-background p-4 rounded-lg overflow-x-auto border">
                {analysis.formattedData}
              </pre>
            </Card>

            {/* Call Prompt */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                AI Call Prompt
              </h3>
              <div className="text-sm whitespace-pre-wrap bg-background p-4 rounded-lg border">
                {analysis.callPrompt}
              </div>
            </Card>

            {/* Talking Points */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Key Talking Points</h3>
                <ul className="space-y-2">
                  {analysis.talkingPoints.map((point: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                className="flex-1"
                size="lg"
                onClick={() => onStartCall(user)}
                disabled={isCallingNow}
              >
                {isCallingNow ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Calling...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Start Call Now
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg">
                Schedule Call
              </Button>
              <Button variant="ghost" size="lg">
                Copy Analysis
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
