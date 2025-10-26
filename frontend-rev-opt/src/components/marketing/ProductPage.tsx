import {
  BarChart3,
  TrendingUp,
  Users,
  GitBranch,
  Bell,
  Database,
  Activity,
  DollarSign,
  Workflow,
} from 'lucide-react';
import { MarketingHeader } from './MarketingHeader';
import { MarketingFooter } from './MarketingFooter';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';

type Route = 'landing' | 'product' | 'solutions' | 'pricing' | 'security';

interface ProductPageProps {
  onNavigate: (route: Route) => void;
  onLogin: () => void;
}

export function ProductPage({ onNavigate, onLogin }: ProductPageProps) {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Dashboards',
      description:
        'Pre-built and custom dashboards with real-time KPIs, time-series charts, and cohort heatmaps.',
      capabilities: [
        'Executive, Finance, and Growth views',
        'Drag-and-drop customization',
        'Scheduled exports & sharing',
        'Mobile-responsive design',
      ],
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Funnels',
      description:
        'Visual funnel builder with conversion tracking, drop-off analysis, and segment comparison.',
      capabilities: [
        'Multi-step funnel visualization',
        'Time-to-convert analysis',
        'Breakdown by any dimension',
        'Historical trend comparison',
      ],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Cohorts & Retention',
      description:
        'Cohort analysis with retention curves, LTV projection, and payback period calculations.',
      capabilities: [
        'Retention heatmaps & curves',
        'LTV by channel and plan',
        'Churn prediction',
        'Cohort comparison tools',
      ],
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: 'User Flows & Sessions',
      description:
        'Sankey diagrams showing user journeys, path analysis, and session-level insights.',
      capabilities: [
        'Visual path exploration',
        'Drop-off identification',
        'Session replay integration',
        'Conversion path optimization',
      ],
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Revenue & P/L',
      description:
        'Complete revenue analytics with P&L integration, margin analysis, and unit economics.',
      capabilities: [
        'Revenue by product/channel/region',
        'COGS, infra, marketing costs',
        'Contribution margin (CM1/2/3)',
        'ARPU, ARPPU, CAC tracking',
      ],
    },
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: 'Experiments (A/B)',
      description:
        'Built-in experimentation platform with statistical testing and automated analysis.',
      capabilities: [
        'Lift & significance badges',
        'Guardrail metrics',
        'Multi-variant testing',
        'Experiment calendar',
      ],
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Alerts & Anomalies',
      description:
        'Smart alerting with threshold and statistical anomaly detection across all metrics.',
      capabilities: [
        'Threshold & ML-based alerts',
        'Slack, Email, Webhook delivery',
        'Alert history & resolution',
        'Custom alert conditions',
      ],
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Data Catalog & Governance',
      description:
        'Centralized metric dictionary with ownership, lineage, and request workflows.',
      capabilities: [
        'Metric definitions & owners',
        'Data freshness indicators',
        'Lineage documentation',
        'Request-new-metric flow',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <MarketingHeader onNavigate={onNavigate} onLogin={onLogin} />

      {/* Hero */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The complete revenue analytics platform
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            From raw events to profit & loss—everything you need to understand and optimize your B2B revenue in one place.
          </p>
          <Button size="lg" onClick={onLogin} className="rounded-xl">
            Explore Features
          </Button>
        </div>
      </section>

      {/* Screenshot */}
      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <Card className="overflow-hidden border-2">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBzY3JlZW58ZW58MXx8fHwxNzYxMzMzODE5fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="ProductName Dashboard"
            className="w-full h-auto"
          />
        </Card>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 border-t border-border/40">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Every tool your revenue team needs
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for Finance, Product, and Growth teams working together
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Activity className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-muted/30 py-16 lg:py-24 border-y border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Connects to your entire stack
            </h2>
            <p className="text-lg text-muted-foreground">
              Native integrations with data warehouses, CRMs, and billing systems
            </p>
          </div>

          <Tabs defaultValue="warehouses" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="warehouses">Data Warehouses</TabsTrigger>
              <TabsTrigger value="platforms">Analytics Platforms</TabsTrigger>
              <TabsTrigger value="business">Business Tools</TabsTrigger>
            </TabsList>
            <TabsContent value="warehouses" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Snowflake', 'BigQuery', 'Redshift', 'Databricks'].map((tool) => (
                  <Card key={tool} className="p-4 text-center">
                    <div className="font-medium">{tool}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="platforms" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Segment', 'Mixpanel', 'Amplitude', 'PostHog'].map((tool) => (
                  <Card key={tool} className="p-4 text-center">
                    <div className="font-medium">{tool}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="business" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Salesforce', 'HubSpot', 'Stripe', 'ChartMogul'].map((tool) => (
                  <Card key={tool} className="p-4 text-center">
                    <div className="font-medium">{tool}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <Card className="p-8 lg:p-12 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See it in action
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our interactive demo or schedule a personalized walkthrough
          </p>
          <Button size="lg" onClick={onLogin} className="rounded-xl">
            Try Demo Now
          </Button>
        </Card>
      </section>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
}
