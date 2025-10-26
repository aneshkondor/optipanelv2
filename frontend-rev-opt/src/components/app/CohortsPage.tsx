import { Plus } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function CohortsPage() {
  const cohorts = [
    { name: 'High-Value Users', users: 12400, criteria: 'Revenue > $1000/mo', color: 'bg-chart-1' },
    { name: 'Trial Users', users: 8600, criteria: 'Status = Trial', color: 'bg-chart-2' },
    { name: 'At-Risk Churn', users: 3200, criteria: 'Activity < 2 days', color: 'bg-chart-3' },
    { name: 'Enterprise Segment', users: 1850, criteria: 'Plan = Enterprise', color: 'bg-chart-4' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cohorts & Segments</h1>
          <p className="text-muted-foreground mt-1">
            Create and analyze user segments
          </p>
        </div>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          New Cohort
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {cohorts.map((cohort) => (
          <Card key={cohort.name} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${cohort.color}`} />
                <h3 className="font-semibold">{cohort.name}</h3>
              </div>
              <Badge variant="secondary">{cohort.users.toLocaleString()} users</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{cohort.criteria}</p>
            <div className="mt-4 pt-4 border-t border-border flex gap-2">
              <Button variant="outline" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
