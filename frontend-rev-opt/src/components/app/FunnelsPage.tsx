import { Plus, TrendingDown, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

export function FunnelsPage() {
  const funnel = [
    { step: 'Landing Page Visit', users: 125400, conversion: 100, dropOff: 0 },
    { step: 'Sign Up Started', users: 45200, conversion: 36.0, dropOff: 64.0 },
    { step: 'Email Verified', users: 38100, conversion: 30.4, dropOff: 15.7 },
    { step: 'Trial Started', users: 28600, conversion: 22.8, dropOff: 24.9 },
    { step: 'Feature Used', users: 18200, conversion: 14.5, dropOff: 36.4 },
    { step: 'Paid Conversion', users: 8900, conversion: 7.1, dropOff: 51.1 },
  ];

  const segments = [
    { name: 'Organic Traffic', conversion: 8.2, users: 3200 },
    { name: 'Paid Traffic', conversion: 6.4, users: 2800 },
    { name: 'Referral', conversion: 9.1, users: 1900 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Funnels</h1>
          <p className="text-muted-foreground mt-1">
            Analyze user conversion and drop-off patterns
          </p>
        </div>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          Create Funnel
        </Button>
      </div>

      {/* Funnel Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Overall Conversion</div>
          <div className="text-3xl font-bold">7.1%</div>
          <div className="text-sm text-success mt-1">↑ 0.8% vs last period</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Users</div>
          <div className="text-3xl font-bold">125.4K</div>
          <div className="text-sm text-success mt-1">↑ 12.3% vs last period</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Avg. Time to Convert</div>
          <div className="text-3xl font-bold">4.2 days</div>
          <div className="text-sm text-muted-foreground mt-1">Median: 2.8 days</div>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">User Journey Funnel</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              Breakdown
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {funnel.map((step, index) => (
            <div key={step.step} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{step.step}</div>
                    <div className="text-sm text-muted-foreground">
                      {step.users.toLocaleString()} users
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-sm">
                    {step.conversion.toFixed(1)}%
                  </Badge>
                  {index > 0 && (
                    <div className="text-sm text-destructive">
                      −{step.dropOff.toFixed(1)}% drop
                    </div>
                  )}
                </div>
              </div>

              <div className="relative h-12">
                <div className="absolute inset-0 bg-muted rounded-lg" />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-lg transition-all"
                  style={{ width: `${step.conversion}%` }}
                />
              </div>

              {index < funnel.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <TrendingDown className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Segment Comparison */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Conversion by Segment</h3>
        <div className="space-y-4">
          {segments.map((segment) => (
            <div key={segment.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{segment.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {segment.users.toLocaleString()} conversions
                  </span>
                  <Badge>{segment.conversion}%</Badge>
                </div>
              </div>
              <Progress value={segment.conversion * 10} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
