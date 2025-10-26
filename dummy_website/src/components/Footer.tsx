import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="mb-4">About StoreName</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted online grocery store delivering fresh products to your
              doorstep.
            </p>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 StoreName. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
