import { DollarSign } from 'lucide-react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function RevenuePage() {
  const revenueByProduct = [
    { product: 'Pro Plan', revenue: 890000, cogs: 245000 },
    { product: 'Enterprise', revenue: 680000, cogs: 165000 },
    { product: 'Starter', revenue: 320000, cogs: 98000 },
  ];

  const unitEconomics = [
    { metric: 'ARPU', value: '$145', change: '+8.2%' },
    { metric: 'ARPPU', value: '$189', change: '+12.1%' },
    { metric: 'CM1', value: '72.4%', change: '+2.3%' },
    { metric: 'CM2', value: '58.2%', change: '+1.8%' },
    { metric: 'CAC', value: '$892', change: '−8.7%' },
    { metric: 'LTV:CAC', value: '16.3x', change: '+2.4x' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue & P/L</h1>
        <p className="text-muted-foreground mt-1">
          Complete revenue analytics and profitability analysis
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {unitEconomics.map((item) => (
          <Card key={item.metric} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">{item.metric}</div>
              <div className={`text-sm ${item.change.startsWith('+') || item.change.startsWith('−') && item.metric === 'CAC' ? 'text-success' : 'text-success'}`}>
                {item.change}
              </div>
            </div>
            <div className="text-2xl font-bold">{item.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <Tabs defaultValue="product">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Revenue Breakdown</h3>
            <TabsList>
              <TabsTrigger value="product">By Product</TabsTrigger>
              <TabsTrigger value="channel">By Channel</TabsTrigger>
              <TabsTrigger value="region">By Region</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="product">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueByProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="product" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue" radius={[8, 8, 0, 0]} />
                <Bar dataKey="cogs" fill="hsl(var(--chart-3))" name="COGS" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="channel">
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Channel breakdown view
            </div>
          </TabsContent>

          <TabsContent value="region">
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Regional breakdown view
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
