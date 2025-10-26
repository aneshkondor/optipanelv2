import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export function FlowsPage() {
  const pathData = [
    { from: 'Landing', to: 'Pricing', users: 12400, conversion: 27.5 },
    { from: 'Pricing', to: 'Signup', users: 8600, conversion: 69.4 },
    { from: 'Landing', to: 'Features', users: 8200, conversion: 18.1 },
    { from: 'Features', to: 'Pricing', users: 6100, conversion: 74.4 },
    { from: 'Signup', to: 'Onboarding', users: 7800, conversion: 90.7 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Flows & Sessions</h1>
        <p className="text-muted-foreground mt-1">
          Visualize user journeys and identify drop-off points
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Top User Paths</h3>
        <div className="space-y-4">
          {pathData.map((path, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Badge variant="outline">{path.from}</Badge>
                <div className="flex-1 h-2 bg-gradient-to-r from-primary/50 to-primary/20 rounded" />
                <Badge variant="outline">{path.to}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">{path.users.toLocaleString()} users</span>
                <Badge variant="secondary">{path.conversion}%</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Session Duration</h3>
          <div className="text-3xl font-bold mb-2">8m 42s</div>
          <p className="text-sm text-muted-foreground">Average session length</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Pages per Session</h3>
          <div className="text-3xl font-bold mb-2">4.8</div>
          <p className="text-sm text-muted-foreground">Average pages viewed</p>
        </Card>
      </div>
    </div>
  );
}
