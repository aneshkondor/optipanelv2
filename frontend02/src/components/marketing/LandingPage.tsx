import { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Zap,
  Database,
  ArrowRight,
  Shield,
  Lock,
  Award,
  Star,
  BarChart3,
  Users,
  Target,
  LineChart,
  Filter,
  GitBranch,
  Activity,
  DollarSign,
  Repeat,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Gauge,
  TrendingDown,
  ChevronRight,
  MessageSquare,
  Building2,
} from 'lucide-react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import { MarketingHeader } from './MarketingHeader';
import { MarketingFooter } from './MarketingFooter';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type Route = 'landing' | 'product' | 'solutions' | 'pricing' | 'security';

interface LandingPageProps {
  onNavigate: (route: Route) => void;
  onLogin: () => void;
}

export function LandingPage({ onNavigate, onLogin }: LandingPageProps) {
  const [activeMetric, setActiveMetric] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Rotating metrics showcase
  const metrics = [
    { label: 'Revenue', value: 2847231, prefix: '$', suffix: '', change: '+12.3%', positive: true },
    { label: 'MRR', value: 284500, prefix: '$', suffix: '', change: '+9.4%', positive: true },
    { label: 'NRR', value: 124, prefix: '', suffix: '%', change: '+3.8%', positive: true },
    { label: 'CAC', value: 892, prefix: '$', suffix: '', change: '-8.7%', positive: true },
    { label: 'LTV', value: 14500, prefix: '$', suffix: '', change: '+15.2%', positive: true },
    { label: 'Conversion', value: 23.4, prefix: '', suffix: '%', change: '+5.1%', positive: true },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const logos = [
    { name: 'Acme Corp', industry: 'Enterprise SaaS' },
    { name: 'TechFlow', industry: 'DevTools' },
    { name: 'DataSync', industry: 'Data Platform' },
    { name: 'CloudScale', industry: 'Infrastructure' },
    { name: 'RevOps Inc', industry: 'Sales Tech' },
    { name: 'GrowthLabs', industry: 'Marketing' },
  ];

  const stats = [
    { value: '10M+', label: 'Events Analyzed Daily', icon: <Activity className="h-5 w-5" /> },
    { value: '99.9%', label: 'Uptime SLA', icon: <Gauge className="h-5 w-5" /> },
    { value: '<100ms', label: 'Query Response', icon: <Clock className="h-5 w-5" /> },
    { value: '500+', label: 'Companies Trust Us', icon: <Building2 className="h-5 w-5" /> },
  ];

  const capabilities = [
    {
      title: 'Event Analytics',
      description: 'Track every user interaction',
      icon: <BarChart3 className="h-5 w-5" />,
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Auto-capture events', 'Custom properties', 'Retroactive analysis'],
    },
    {
      title: 'Funnel Analysis',
      description: 'Optimize conversion paths',
      icon: <Filter className="h-5 w-5" />,
      gradient: 'from-purple-500 to-pink-500',
      features: ['Multi-step funnels', 'Cohort breakdown', 'Time-to-convert'],
    },
    {
      title: 'Retention & Cohorts',
      description: 'Understand user lifecycle',
      icon: <Users className="h-5 w-5" />,
      gradient: 'from-green-500 to-emerald-500',
      features: ['N-day retention', 'Behavioral cohorts', 'Churn prediction'],
    },
    {
      title: 'Revenue Analytics',
      description: 'Connect metrics to money',
      icon: <DollarSign className="h-5 w-5" />,
      gradient: 'from-orange-500 to-red-500',
      features: ['LTV & CAC', 'MRR tracking', 'P&L integration'],
    },
  ];

  const useCases = [
    {
      title: 'Product Teams',
      description: 'Build features users love',
      metrics: ['Feature adoption', 'User engagement', 'Product-market fit'],
      icon: <Target className="h-6 w-6" />,
      color: 'text-blue-500',
    },
    {
      title: 'Growth Teams',
      description: 'Optimize acquisition & activation',
      metrics: ['Conversion funnels', 'A/B experiments', 'Activation rates'],
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-green-500',
    },
    {
      title: 'Revenue Teams',
      description: 'Drive sustainable growth',
      metrics: ['Revenue attribution', 'Expansion revenue', 'Churn reduction'],
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-purple-500',
    },
  ];

  const testimonials = [
    {
      quote: 'ProductName helped us identify a 23% revenue leak in our checkout funnel. We fixed it in a week and saw immediate ROI.',
      author: 'Sarah Chen',
      role: 'VP Revenue',
      company: 'TechFlow',
      avatar: 'SC',
      metric: '+$2.3M ARR',
      rating: 5,
    },
    {
      quote: 'The cohort analysis is phenomenal. We reduced CAC by 18% and increased LTV by 31% in just 6 months.',
      author: 'Michael Rodriguez',
      role: 'Head of Growth',
      company: 'GrowthLabs',
      avatar: 'MR',
      metric: '31% LTV ↑',
      rating: 5,
    },
    {
      quote: 'Finally, our finance and product teams speak the same language. The P&L integration changed how we make decisions.',
      author: 'Emily Watson',
      role: 'CFO',
      company: 'CloudScale',
      avatar: 'EW',
      metric: '100% alignment',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      <MarketingHeader onNavigate={onNavigate} onLogin={onLogin} />

      {/* Hero Section - Redesigned */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent rounded-full blur-3xl"
          />
        </div>

        <motion.div style={{ y, opacity }} className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-primary mb-6"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm">AI-Powered Revenue Analytics Platform</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                >
                  Turn data into
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {' '}revenue growth
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-xl text-muted-foreground mb-8 leading-relaxed"
                >
                  The complete analytics platform for B2B revenue teams. From event
                  tracking to P&L—make data-driven decisions that actually move the needle.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                >
                  <Button
                    size="lg"
                    onClick={onLogin}
                    className="rounded-xl text-base h-14 px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group shadow-lg shadow-primary/25"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsPlaying(true)}
                    className="rounded-xl text-base h-14 px-8 group"
                  >
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Free 14-day trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Setup in minutes</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Interactive Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <DashboardPreview metrics={metrics} activeMetric={activeMetric} />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/40 bg-muted/30 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-primary">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mb-12"
          >
            Trusted by fast-growing B2B companies worldwide
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <div className="text-center p-4 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="font-semibold text-muted-foreground/60 group-hover:text-foreground transition-colors mb-1">
                    {logo.name}
                  </div>
                  <div className="text-xs text-muted-foreground/40">{logo.industry}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Showcase */}
      <section className="py-16 lg:py-24 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">
              Complete Analytics Platform
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need in one place
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stop piecing together multiple tools. Get the complete picture from events
              to revenue.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => (
              <CapabilityCard key={index} capability={capability} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Product Showcase */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for every revenue team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From product to growth to finance—everyone gets the insights they need
            </p>
          </motion.div>

          <Tabs defaultValue="product" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {useCases.map((useCase) => (
                <TabsTrigger key={useCase.title} value={useCase.title.toLowerCase().split(' ')[0]}>
                  <span className={useCase.color}>{useCase.icon}</span>
                  <span className="ml-2">{useCase.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {useCases.map((useCase) => (
              <TabsContent
                key={useCase.title}
                value={useCase.title.toLowerCase().split(' ')[0]}
                className="mt-0"
              >
                <UseCaseCard useCase={useCase} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-warning text-warning" />
              ))}
              <span className="ml-2 text-muted-foreground">4.9/5 from 500+ reviews</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by revenue teams</h2>
            <p className="text-xl text-muted-foreground">
              See how companies use ProductName to drive real results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden border-2 border-primary/20">
              {/* Animated background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10" />
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 50%, rgba(110, 86, 207, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
                    backgroundSize: '100% 100%',
                  }}
                />
              </div>

              <div className="relative z-10 p-12 lg:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready to optimize your revenue?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join 500+ B2B companies turning data into growth. Start your free trial
                  today—no credit card required.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button
                    size="lg"
                    onClick={onLogin}
                    className="rounded-xl text-base h-14 px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group shadow-lg"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onLogin}
                    className="rounded-xl text-base h-14 px-8"
                  >
                    Book a Demo
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">SOC 2 Type II</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">ISO 27001</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
}

// Interactive Dashboard Preview Component
function DashboardPreview({ metrics, activeMetric }: any) {
  return (
    <div className="relative">
      {/* Main card */}
      <motion.div
        className="relative z-10"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Card className="p-8 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border-2 shadow-2xl">
          {/* Mini chart */}
          <div className="mb-6 h-32 rounded-lg bg-gradient-to-br from-primary/5 to-purple-500/5 p-4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 flex items-end justify-around px-4 pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(12)].map((_, i) => {
                const height = 40 + Math.random() * 60;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`w-2 rounded-t ${
                      i === activeMetric ? 'bg-primary' : 'bg-primary/30'
                    }`}
                  />
                );
              })}
            </motion.div>
          </div>

          {/* Animated metric display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMetric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-muted-foreground mb-2">
                {metrics[activeMetric].label}
              </div>
              <div className="text-4xl font-bold mb-2">
                {metrics[activeMetric].prefix}
                {metrics[activeMetric].value.toLocaleString()}
                {metrics[activeMetric].suffix}
              </div>
              <div
                className={`text-sm ${
                  metrics[activeMetric].positive ? 'text-success' : 'text-destructive'
                }`}
              >
                {metrics[activeMetric].change}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Metric dots */}
          <div className="flex gap-2 mt-6">
            {metrics.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeMetric ? 'w-8 bg-primary' : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-6 -right-6 z-0"
      >
        <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-sm border border-primary/10 shadow-xl" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-6 -left-6 z-0"
      >
        <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-sm border border-pink-500/10 shadow-xl" />
      </motion.div>
    </div>
  );
}

// Capability Card Component
function CapabilityCard({ capability, index }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="p-6 h-full group cursor-pointer overflow-hidden relative border-2 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl">
        {/* Gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        <div className="relative z-10">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${capability.gradient} flex items-center justify-center mb-4 text-white shadow-lg`}
          >
            {capability.icon}
          </motion.div>

          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {capability.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">{capability.description}</p>

          <div className="space-y-2">
            {capability.features.map((feature: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: index * 0.1 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Use Case Card Component
function UseCaseCard({ useCase }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-8 lg:p-12 bg-gradient-to-br from-card to-card/50">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className={`inline-flex p-3 rounded-xl bg-muted mb-4 ${useCase.color}`}>
              {useCase.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
            <p className="text-lg text-muted-foreground mb-6">{useCase.description}</p>

            <div className="space-y-3">
              {useCase.metrics.map((metric: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{metric}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-muted to-muted/50 border-2 flex items-center justify-center">
              <div className="text-muted-foreground/40">
                <BarChart3 className="h-16 w-16" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Testimonial Card Component
function TestimonialCard({ testimonial, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="p-6 h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-1">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-warning text-warning" />
            ))}
          </div>
          <Badge variant="secondary" className="text-xs font-semibold">
            {testimonial.metric}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          &quot;{testimonial.quote}&quot;
        </p>

        <div className="flex items-center gap-3 pt-4 border-t">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
            {testimonial.avatar}
          </div>
          <div>
            <div className="font-semibold">{testimonial.author}</div>
            <div className="text-sm text-muted-foreground">
              {testimonial.role}, {testimonial.company}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
