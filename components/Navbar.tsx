
import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/demo', label: 'Demo' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/evidence', label: 'Evidence' },
  { href: '/clinicians', label: 'Clinicians' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/docs', label: 'Docs' },
];

const Navbar = () => {
    const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  cn(
                    "transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button asChild>
            <Link to="/demo">Try the Demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
