import { Card } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function RetentionPage() {
  const retentionData = [
    { week: 'Week 0', cohort1: 100, cohort2: 100, cohort3: 100 },
    { week: 'Week 1', cohort1: 85, cohort2: 87, cohort3: 89 },
    { week: 'Week 2', cohort1: 72, cohort2: 74, cohort3: 76 },
    { week: 'Week 4', cohort1: 65, cohort2: 67, cohort3: 70 },
    { week: 'Week 8', cohort1: 58, cohort2: 61, cohort3: 65 },
    { week: 'Week 12', cohort1: 52, cohort2: 56, cohort3: 60 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Retention & LTV</h1>
        <p className="text-muted-foreground mt-1">
          Understand customer retention and lifetime value
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">30-Day Retention</div>
          <div className="text-3xl font-bold">68%</div>
          <div className="text-sm text-success mt-1">↑ 4.2% vs last cohort</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Average LTV</div>
          <div className="text-3xl font-bold">$14,500</div>
          <div className="text-sm text-success mt-1">↑ 15.2% vs last cohort</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Payback Period</div>
          <div className="text-3xl font-bold">4.2 months</div>
          <div className="text-sm text-success mt-1">↓ 0.8 months</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-6">Retention Curves</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={retentionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="cohort1" stroke="hsl(var(--chart-1))" name="Jan 2024" strokeWidth={2} />
            <Line type="monotone" dataKey="cohort2" stroke="hsl(var(--chart-2))" name="Feb 2024" strokeWidth={2} />
            <Line type="monotone" dataKey="cohort3" stroke="hsl(var(--chart-3))" name="Mar 2024" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
