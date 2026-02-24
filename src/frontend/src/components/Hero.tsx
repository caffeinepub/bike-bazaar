import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';
import { useGetWebsiteContent } from '../hooks/useQueries';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: content } = useGetWebsiteContent();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/listings', search: { query: searchQuery } });
    }
  };

  const defaultHeroText = {
    heading: 'Find Your Perfect Second-Hand Bike',
    description: 'Browse quality pre-owned bikes in Bijapur. Trusted sellers, verified listings, and great deals.',
  };

  // Parse hero content if available
  let heroHeading = defaultHeroText.heading;
  let heroDescription = defaultHeroText.description;

  if (content?.heroSection) {
    const lines = content.heroSection.split('\n').filter(line => line.trim());
    if (lines.length > 0) heroHeading = lines[0];
    if (lines.length > 1) heroDescription = lines.slice(1).join(' ');
  }

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-banner.dim_1920x600.png"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
            {heroHeading}
          </h1>
          <p className="text-xl text-white/90 mb-8">
            {heroDescription}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by brand, model, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white/95 backdrop-blur"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8">
                Search
              </Button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate({ to: '/listings' })}
              className="gap-2"
            >
              Browse All Bikes
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/sell' })}
              className="gap-2 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
            >
              Sell Your Bike
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
