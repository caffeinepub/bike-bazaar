import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { useGetWebsiteContent } from '../hooks/useQueries';

export default function Footer() {
  const { data: content } = useGetWebsiteContent();
  const currentYear = new Date().getFullYear();
  
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname)
    : 'unknown-app';

  const defaultFooterInfo = 'Contact us for any inquiries about buying or selling bikes in Bijapur.';

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/generated/logo.dim_200x200.png" alt="2nd Bike Bajar" className="h-10 w-10" />
              <span className="font-display text-xl font-bold text-primary">2nd Bike Bajar</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {content?.footerInfo || defaultFooterInfo}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/listings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Bikes
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sell Your Bike
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Bijapur, Chhattisgarh<br />
              Email: rohitmarpalli@gmail.com<br />
              Phone: 7828226397
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear} 2nd Bike Bajar Bijapur. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
