import { Plus, Database, Clock, User, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

export function DataCatalogPage() {
  const metrics = [
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Metric definitions and data governance
          </p>
        </div>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          Request New Metric
        </Button>
      </div>

      <Card className="p-4">
        <Input placeholder="Search metrics..." className="w-full" />
      </Card>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Database className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{metric.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {metric.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{metric.owner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{metric.freshness}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={metric.usage === 'High' ? 'default' : 'secondary'}
                >
                  {metric.usage} Usage
                </Badge>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" size="sm">
                View Lineage
              </Button>
              <Button variant="ghost" size="sm">
                Edit Definition
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
