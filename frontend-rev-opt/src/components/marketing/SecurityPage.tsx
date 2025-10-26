import { Shield, Lock, Eye, FileCheck, Server, Users, Key, AlertCircle } from 'lucide-react';
import { MarketingHeader } from './MarketingHeader';
import { MarketingFooter } from './MarketingFooter';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

type Route = 'landing' | 'product' | 'solutions' | 'pricing' | 'security';

interface SecurityPageProps {
  onNavigate: (route: Route) => void;
  onLogin: () => void;
}

export function SecurityPage({ onNavigate, onLogin }: SecurityPageProps) {
  const certifications = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'SOC 2 Type II',
      description: 'Independently audited security controls and practices',
      status: 'Certified',
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: 'GDPR Compliant',
      description: 'Full compliance with EU data protection regulation',
      status: 'Compliant',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'CCPA Compliant',
      description: 'California Consumer Privacy Act compliance',
      status: 'Compliant',
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: 'ISO 27001',
      description: 'Information security management system certification',
      status: 'Certified',
    },
  ];

  const securityFeatures = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Data Encryption',
      description:
        'All data encrypted at rest using AES-256 and in transit using TLS 1.3. Encryption keys managed through AWS KMS.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Access Control',
      description:
        'Role-based permissions, SSO via SAML 2.0, and multi-factor authentication. Granular data access controls.',
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Audit Logging',
      description:
        'Complete audit trail of all user actions, data access, and system changes. Logs retained for compliance.',
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: 'Infrastructure Security',
      description:
        'SOC 2 compliant infrastructure hosted on AWS. Regular penetration testing and vulnerability assessments.',
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: 'Data Residency',
      description:
        'Choose where your data is stored. Support for US, EU, and custom regions. Data never leaves your region.',
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: 'Incident Response',
      description:
        '24/7 security monitoring with documented incident response procedures. Transparent communication.',
    },
  ];

  const privacyCommitments = [
    'Your data is never used to train AI models',
    'No selling or sharing of customer data',
    'You can export or delete your data anytime',
    'Transparent data processing agreements',
    'Regular third-party security audits',
    'Dedicated security and compliance team',
  ];

  return (
    <div className="min-h-screen">
      <MarketingHeader onNavigate={onNavigate} onLogin={onLogin} />

      {/* Hero */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success mb-6 text-sm">
            <Shield className="h-4 w-4" />
            <span>Enterprise-grade security & compliance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your data security is our top priority
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Bank-level encryption, comprehensive compliance, and transparent practices to keep your revenue data secure.
          </p>
          <Button size="lg" onClick={onLogin} className="rounded-xl">
            View Security Documentation
          </Button>
        </div>
      </section>

      {/* Certifications */}
      <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="h-16 w-16 rounded-xl bg-success/10 text-success flex items-center justify-center mx-auto mb-4">
                {cert.icon}
              </div>
              <h3 className="font-semibold mb-2">{cert.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{cert.description}</p>
              <Badge variant="secondary" className="bg-success/10 text-success">
                {cert.status}
              </Badge>
            </Card>
          ))}
        </div>
      </section>

      {/* Security Features */}
      <section className="bg-muted/30 py-16 lg:py-24 border-y border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive security measures
            </h2>
            <p className="text-lg text-muted-foreground">
              Multiple layers of protection for your data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Commitments */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our privacy commitments
            </h2>
            <p className="text-lg text-muted-foreground">
              Clear, simple promises about how we handle your data
            </p>
          </div>

          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {privacyCommitments.map((commitment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{commitment}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Data Processing */}
      <section className="bg-muted/30 py-16 lg:py-24 border-y border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              How we process your data
            </h2>
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Data Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    We only collect data necessary for providing analytics services. You control what data is sent to ProductName.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    Data stored in secure, SOC 2 compliant data centers in your chosen region. Encrypted at rest with AES-256.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Access limited to authorized personnel with strict need-to-know policies. All access logged and monitored.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Retention</h4>
                  <p className="text-sm text-muted-foreground">
                    You control retention policies. Data can be exported or deleted at any time through our interface or API.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <Card className="p-8 lg:p-12 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions about security?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our security team is here to help. Contact us for detailed documentation, penetration test results, or custom security requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onLogin} className="rounded-xl">
              Contact Security Team
            </Button>
            <Button size="lg" variant="outline" onClick={onLogin} className="rounded-xl">
              Download Security Whitepaper
            </Button>
          </div>
        </Card>
      </section>

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
}
