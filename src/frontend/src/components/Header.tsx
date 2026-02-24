import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsFounder } from '../hooks/useQueries';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isFounder } = useIsFounder();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/listings', label: 'Browse Bikes' },
    { to: '/about', label: 'About Us' },
    ...(isAuthenticated ? [
      { to: '/sell', label: 'Sell Your Bike' },
      { to: '/my-listings', label: 'My Listings' }
    ] : []),
    ...(isFounder ? [{ to: '/admin', label: 'Admin Panel' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/logo.dim_200x200.png" alt="2nd Bike Bajar" className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-primary">2nd Bike Bajar</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                activeProps={{ className: 'text-primary' }}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/founder-login' })}
            >
              Founder Login
            </Button>
            <LoginButton />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  activeProps={{ className: 'text-primary' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ to: '/founder-login' });
                }}
              >
                Founder Login
              </Button>
              <div className="pt-2 border-t">
                <LoginButton />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
