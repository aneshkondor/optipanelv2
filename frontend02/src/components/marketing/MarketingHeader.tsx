import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ThemeToggle';

type Route = 'landing' | 'product' | 'solutions' | 'pricing' | 'security';

interface MarketingHeaderProps {
  onNavigate: (route: Route) => void;
  onLogin: () => void;
}

export function MarketingHeader({ onNavigate, onLogin }: MarketingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; route: Route }[] = [
    { label: 'Product', route: 'product' },
    { label: 'Solutions', route: 'solutions' },
    { label: 'Pricing', route: 'pricing' },
    { label: 'Security', route: 'security' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
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
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => onNavigate(link.route)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" onClick={onLogin}>
              Sign In
            </Button>
            <Button onClick={onLogin} className="rounded-xl">
              Try Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => {
                    onNavigate(link.route);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" onClick={onLogin} className="w-full">
                  Sign In
                </Button>
                <Button onClick={onLogin} className="w-full rounded-xl">
                  Try Demo
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
