import { Twitter, Linkedin, Github } from 'lucide-react';

type Route = 'landing' | 'product' | 'solutions' | 'pricing' | 'security';

interface MarketingFooterProps {
  onNavigate: (route: Route) => void;
}

export function MarketingFooter({ onNavigate }: MarketingFooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', route: 'product' as Route },
        { label: 'Pricing', route: 'pricing' as Route },
        { label: 'Security', route: 'security' as Route },
        { label: 'Changelog', route: 'product' as Route },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'SaaS', route: 'solutions' as Route },
        { label: 'E-commerce', route: 'solutions' as Route },
        { label: 'Fintech', route: 'solutions' as Route },
        { label: 'Marketplaces', route: 'solutions' as Route },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', route: 'product' as Route },
        { label: 'API Reference', route: 'product' as Route },
        { label: 'Guides', route: 'product' as Route },
        { label: 'Blog', route: 'landing' as Route },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', route: 'landing' as Route },
        { label: 'Careers', route: 'landing' as Route },
        { label: 'Contact', route: 'landing' as Route },
        { label: 'Partners', route: 'landing' as Route },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="font-semibold text-lg">ProductName</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              World-class revenue analytics for modern B2B teams.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-3 text-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate(link.route)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ProductName. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
