import { useState } from 'react';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { MarketingHeader } from './MarketingHeader';
import { MarketingFooter } from './MarketingFooter';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';

type Route = 'landing' | 'product' | 'solutions' | 'pricing' | 'security';

interface PricingPageProps {
  onNavigate: (route: Route) => void;
  onLogin: () => void;
}

export function PricingPage({ onNavigate, onLogin }: PricingPageProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'For small teams getting started with revenue analytics',
      monthlyPrice: 299,
      annualPrice: 249,
      features: [
        'Up to 5 team members',
        '1M events per month',
        'Pre-built dashboards',
        'Funnels & cohorts',
        'Email support',
        '30-day data retention',
        'CSV export',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Growth',
      description: 'For growing teams that need advanced analytics',
      monthlyPrice: 899,
      annualPrice: 749,
      features: [
        'Up to 25 team members',
        '10M events per month',
        'Everything in Starter',
        'Experiments (A/B testing)',
        'User flows & sessions',
        'Revenue & P/L analytics',
        'Alerts & anomalies',
        'Slack integration',
        'Priority support',
        '1-year data retention',
        'API access',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      name: 'Enterprise',
      description: 'For large teams with advanced requirements',
      monthlyPrice: null,
      annualPrice: null,
      features: [
        'Unlimited team members',
        'Custom event volume',
        'Everything in Growth',
        'Data catalog & governance',
        'SSO & SAML',
        'Advanced permissions',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Unlimited data retention',
        'White-label options',
        'Professional services',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const featureCategories = [
    {
      category: 'Core Analytics',
      features: [
        { name: 'Dashboards', starter: true, growth: true, enterprise: true },
        { name: 'Funnels', starter: true, growth: true, enterprise: true },
        { name: 'Cohorts & Retention', starter: true, growth: true, enterprise: true },
        { name: 'User Flows', starter: false, growth: true, enterprise: true },
        { name: 'Revenue & P/L', starter: false, growth: true, enterprise: true },
        { name: 'Experiments', starter: false, growth: true, enterprise: true },
      ],
    },
    {
      category: 'Data & Governance',
      features: [
        { name: 'Data Catalog', starter: false, growth: false, enterprise: true },
        { name: 'Metric Dictionary', starter: false, growth: true, enterprise: true },
        { name: 'Data Lineage', starter: false, growth: false, enterprise: true },
        { name: 'Custom Integrations', starter: false, growth: false, enterprise: true },
      ],
    },
    {
      category: 'Collaboration',
      features: [
        { name: 'Team Members', starter: '5', growth: '25', enterprise: 'Unlimited' },
        { name: 'Slack Integration', starter: false, growth: true, enterprise: true },
        { name: 'Scheduled Reports', starter: false, growth: true, enterprise: true },
        { name: 'Advanced Permissions', starter: false, growth: false, enterprise: true },
      ],
    },
    {
      category: 'Support & Security',
      features: [
        { name: 'Email Support', starter: true, growth: true, enterprise: true },
        { name: 'Priority Support', starter: false, growth: true, enterprise: true },
        { name: 'Dedicated Support', starter: false, growth: false, enterprise: true },
        { name: 'SSO & SAML', starter: false, growth: false, enterprise: true },
        { name: 'SLA Guarantee', starter: false, growth: false, enterprise: true },
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
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={!isAnnual ? 'font-semibold' : 'text-muted-foreground'}>
              Monthly
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={isAnnual ? 'font-semibold' : 'text-muted-foreground'}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 flex flex-col ${
                plan.highlighted ? 'border-2 border-primary shadow-lg scale-105' : ''
              }`}
            >
              {plan.badge && (
                <Badge className="mb-4 w-fit bg-primary">{plan.badge}</Badge>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <div className="mb-6">
                {plan.monthlyPrice ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Billed annually at ${(plan.annualPrice! * 12).toLocaleString()}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-4xl font-bold">Custom</div>
                )}
              </div>

              <Button
                onClick={onLogin}
                variant={plan.highlighted ? 'default' : 'outline'}
                className="w-full rounded-xl mb-6"
                size="lg"
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Compare all features
            </h2>
            <p className="text-lg text-muted-foreground">
              See what's included in each plan
            </p>
          </div>

          <div className="space-y-8">
            {featureCategories.map((category) => (
              <div key={category.category}>
                <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 bg-muted/30 p-4 gap-4">
                    <div className="font-medium">Feature</div>
                    <div className="font-medium text-center">Starter</div>
                    <div className="font-medium text-center">Growth</div>
                    <div className="font-medium text-center">Enterprise</div>
                  </div>
                  {category.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-4 p-4 gap-4 border-t border-border items-center"
                    >
                      <div className="text-sm text-muted-foreground">{feature.name}</div>
                      <div className="text-center">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? (
                            <Check className="h-4 w-4 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-sm">{feature.starter}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.growth === 'boolean' ? (
                          feature.growth ? (
                            <Check className="h-4 w-4 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-sm">{feature.growth}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.enterprise === 'boolean' ? (
                          feature.enterprise ? (
                            <Check className="h-4 w-4 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-sm">{feature.enterprise}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16 lg:py-24 border-y border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Can I change plans later?</h4>
                <p className="text-muted-foreground text-sm">
                  Yes, you can upgrade or downgrade at any time. Changes take effect immediately, and we'll prorate your billing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What counts as an event?</h4>
                <p className="text-muted-foreground text-sm">
                  An event is any tracked action—page views, clicks, purchases, etc. We provide tools to help you optimize event volume.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Do you offer volume discounts?</h4>
                <p className="text-muted-foreground text-sm">
                  Yes, Enterprise plans can be customized based on your event volume and team size. Contact sales for details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <Card className="p-8 lg:p-12 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start your free trial today
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            No credit card required. Get started in minutes.
          </p>
          <Button size="lg" onClick={onLogin} className="rounded-xl">
            Try ProductName Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </section>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
}
