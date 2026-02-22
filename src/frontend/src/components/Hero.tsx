import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1920x600.png)' }}
      >
        <div className="absolute inset-0 hero-gradient" />
      </div>
      
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Find Your Perfect Ride
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Discover quality second-hand bikes from trusted sellers. Your next adventure starts here.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/listings">
              <Button size="lg" className="gap-2 shadow-large">
                Browse Bikes
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/sell">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
                Sell Your Bike
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
