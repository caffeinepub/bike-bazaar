import Hero from '../components/Hero';
import { Link } from '@tanstack/react-router';
import { useGetAvailableListings } from '../hooks/useQueries';
import BikeCard from '../components/BikeCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Search, MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: listings, isLoading } = useGetAvailableListings();
  const featuredListings = listings?.slice(0, 3) || [];

  return (
    <div>
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Why Choose Bike Bazaar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trusted Sellers</h3>
              <p className="text-muted-foreground">
                All sellers are verified through Internet Identity for your peace of mind.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Search</h3>
              <p className="text-muted-foreground">
                Find exactly what you're looking for with powerful filters and search.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Direct Contact</h3>
              <p className="text-muted-foreground">
                Message sellers directly to ask questions and arrange viewings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold">Recent Listings</h2>
            <Link to="/listings">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <BikeCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No listings available yet.</p>
              <Link to="/sell">
                <Button>List Your Bike</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
