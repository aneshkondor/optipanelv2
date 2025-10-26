import { Plus, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';

export function AlertsPage() {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      metric: 'Signup Conversion Rate',
      condition: 'Below 25%',
      current: '23.4%',
      triggered: '2 hours ago',
      active: true,
    },
    {
      id: 2,
      type: 'success',
      metric: 'MRR Growth',
      condition: 'Above $10K',
      current: '$12.4K',
      triggered: '5 hours ago',
      active: true,
    },
    {
      id: 3,
      type: 'critical',
      metric: 'API Error Rate',
      condition: 'Above 1%',
      current: '2.8%',
      triggered: '15 minutes ago',
      active: true,
    },
  ];

  const configured = [
    { metric: 'Revenue', condition: 'Anomaly detected', channels: ['Slack', 'Email'] },
    { metric: 'Active Users', condition: 'Below 10K', channels: ['Slack'] },
    { metric: 'Churn Rate', condition: 'Above 5%', channels: ['Email', 'Webhook'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Anomalies</h1>
          <p className="text-muted-foreground mt-1">
            Monitor metrics and get notified of important changes
          </p>
        </div>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          New Alert
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Active Alerts</h3>
        {alerts.map((alert) => (
          <Card key={alert.id} className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  alert.type === 'warning'
                    ? 'bg-warning/10 text-warning'
                    : alert.type === 'success'
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{alert.metric}</h4>
                  <Badge
                    variant={
                      alert.type === 'critical'
                        ? 'destructive'
                        : alert.type === 'warning'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {alert.type}
                  </Badge>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Condition</div>
                    <div className="font-medium">{alert.condition}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current Value</div>
                    <div className="font-medium">{alert.current}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Triggered</div>
                    <div className="font-medium">{alert.triggered}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Resolve</Button>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-4">Configured Alerts</h3>
        <div className="space-y-3">
          {configured.map((config, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{config.metric}</div>
                  <div className="text-sm text-muted-foreground">{config.condition}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {config.channels.map((channel) => (
                      <Badge key={channel} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
