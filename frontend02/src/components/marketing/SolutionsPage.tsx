import { MarketingHeader } from './MarketingHeader';
import { MarketingFooter } from './MarketingFooter';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TrendingUp, ShoppingCart, CreditCard, Store, ArrowRight } from 'lucide-react';

type Route = 'landing' | 'product' | 'solutions' | 'pricing' | 'security';

interface SolutionsPageProps {
  onNavigate: (route: Route) => void;
  onLogin: () => void;
}

export function SolutionsPage({ onNavigate, onLogin }: SolutionsPageProps) {
  const solutions = [
    {
      id: 'saas',
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'SaaS',
      description: 'Optimize subscription revenue, reduce churn, and maximize LTV',
      outcomes: [
        { metric: '+12% ARPU', description: 'Through upsell optimization' },
        { metric: '−18% Churn', description: 'Via retention analysis' },
        { metric: '+31% LTV', description: 'From cohort insights' },
      ],
      useCases: [
        'MRR/ARR tracking and forecasting',
        'Expansion and contraction analysis',
        'Pricing tier performance',
        'Feature adoption and usage analytics',
      ],
    },
    {
      id: 'ecommerce',
      icon: <ShoppingCart className="h-8 w-8" />,
      title: 'E-commerce',
      description: 'Increase AOV, conversion rates, and customer lifetime value',
      outcomes: [
        { metric: '+23% AOV', description: 'Through cart optimization' },
        { metric: '+8.4% CVR', description: 'Via funnel analysis' },
        { metric: '+27% Repeat', description: 'From retention programs' },
      ],
      useCases: [
        'Checkout funnel optimization',
        'Cart abandonment analysis',
        'Product performance tracking',
        'Customer segmentation & LTV',
      ],
    },
    {
      id: 'fintech',
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Fintech',
      description: 'Drive transaction volume, reduce fraud, and optimize unit economics',
      outcomes: [
        { metric: '+34% TPV', description: 'Through activation optimization' },
        { metric: '−42% Fraud', description: 'Via pattern detection' },
        { metric: '+19% NRR', description: 'From revenue expansion' },
      ],
      useCases: [
        'Transaction and payment analytics',
        'User activation and onboarding',
        'Risk and fraud monitoring',
        'Unit economics optimization',
      ],
    },
    {
      id: 'marketplaces',
      icon: <Store className="h-8 w-8" />,
      title: 'Marketplaces',
      description: 'Balance supply and demand, optimize take rates, and drive GMV',
      outcomes: [
        { metric: '+28% GMV', description: 'Through liquidity optimization' },
        { metric: '+15% Take Rate', description: 'Via pricing analysis' },
        { metric: '−21% CAC', description: 'From channel optimization' },
      ],
      useCases: [
        'Supply and demand balance',
        'Transaction flow optimization',
        'Liquidity and match rate tracking',
        'Multi-sided revenue analytics',
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
            Built for your business model
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Industry-specific analytics that understand your revenue drivers
          </p>
        </div>
      </section>

      {/* Solutions Tabs */}
      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <Tabs defaultValue="saas" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            {solutions.map((solution) => (
              <TabsTrigger key={solution.id} value={solution.id}>
                {solution.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {solutions.map((solution) => (
            <TabsContent key={solution.id} value={solution.id} className="space-y-8">
              {/* Overview */}
              <Card className="p-8">
                <div className="flex items-start gap-6">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    {solution.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{solution.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      {solution.description}
                    </p>
                    <Button onClick={onLogin} className="rounded-xl">
                      Explore {solution.title} Solution
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Outcomes */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Proven Outcomes</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {solution.outcomes.map((outcome, idx) => (
                    <Card key={idx} className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {outcome.metric}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {outcome.description}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Use Cases</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {solution.useCases.map((useCase, idx) => (
                    <Card key={idx} className="p-4 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <div className="text-muted-foreground">{useCase}</div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Case Study */}
      <section className="bg-muted/30 py-16 lg:py-24 border-y border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="max-w-4xl mx-auto p-8 lg:p-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-sm font-medium text-primary">CASE STUDY</div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              How TechFlow increased NRR by 24% in 6 months
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              "ProductName helped us identify which customer segments had the highest expansion potential. By focusing our efforts there, we dramatically improved our net revenue retention."
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-muted-foreground">VP Revenue, TechFlow</div>
              </div>
            </div>
            <Button onClick={onLogin} variant="outline" className="rounded-xl">
              Read Full Case Study
            </Button>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <Card className="p-8 lg:p-12 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to see results?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a personalized demo tailored to your industry
          </p>
          <Button size="lg" onClick={onLogin} className="rounded-xl">
            Book Walkthrough
          </Button>
        </Card>
      </section>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
}
