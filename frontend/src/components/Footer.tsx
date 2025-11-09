
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 mb-6 md:mb-0">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">Agentic AI for reproductive longevity.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/demo" className="text-sm text-muted-foreground hover:text-primary">Demo</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link to="/docs" className="text-sm text-muted-foreground hover:text-primary">Docs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
              <li><a href="mailto:contact@aegiscycle.dev" className="text-sm text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} AegisCycle. All rights reserved.</p>
          <p className="text-xs text-muted-foreground mt-4 sm:mt-0">Demo only — not medical advice.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
