import { Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : '2nd-bike-bajar';

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/assets/generated/logo.dim_200x200.png" alt="2nd Bike Bajar" className="h-8 w-8" />
              <span className="font-display font-bold text-lg">2nd Bike Bajar</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted marketplace for quality second-hand bikes in Bijapur.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/listings" className="hover:text-primary transition-colors">Browse Bikes</Link></li>
              <li><Link to="/sell" className="hover:text-primary transition-colors">Sell Your Bike</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <p className="text-sm text-muted-foreground">
              Find your perfect ride today in Bijapur, Chhattisgarh.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} 2nd Bike Bajar Bijapur. Built with <Heart className="h-4 w-4 text-accent fill-accent" /> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
