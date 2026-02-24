import Hero from '../components/Hero';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useIsBuyerProfileComplete } from '../hooks/useBuyerProfile';
import { useIsFounder } from '../hooks/useQueries';
import { useGetAvailableListings } from '../hooks/useQueries';
import BikeCard from '../components/BikeCard';
import { Button } from '@/components/ui/button';
import { Shield, Search, MessageCircle, UserPlus, Store } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import BuyerRegistrationSection from '../components/BuyerRegistrationSection';
import SellerRegistrationSection from '../components/SellerRegistrationSection';

export default function Home() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: userProfileLoading, isFetched: userProfileFetched } = useGetCallerUserProfile();
  const { data: isFounder } = useIsFounder();
  const { data: isBuyerProfileComplete, isLoading: profileCheckLoading } = useIsBuyerProfileComplete();
  const { data: listings, isLoading } = useGetAvailableListings();

  const hasCompleteProfile = userProfile !== null && isBuyerProfileComplete;
  const canViewListings = !isAuthenticated || isFounder || hasCompleteProfile;

  // Show landing page for unauthenticated users only
  if (!isAuthenticated) {
    return (
      <div>
        <Hero />

        {/* Welcome Message */}
        <section className="py-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-4xl font-bold mb-4">Welcome to 2nd Bike Bajar Bijapur</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted marketplace for buying and selling second-hand bikes. Join our community today!
            </p>
          </div>
        </section>

        {/* Login Options Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center mb-12">Choose Your Login Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Admin Login */}
              <Link to="/admin-login">
                <div className="bg-card border-2 border-primary/20 rounded-lg p-6 hover:shadow-xl transition-all cursor-pointer h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl">Admin Login</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage users, listings, and platform settings
                    </p>
                    <Button className="w-full">
                      Login as Admin
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Founder Login */}
              <Link to="/founder-login">
                <div className="bg-card border-2 border-accent/20 rounded-lg p-6 hover:shadow-xl transition-all cursor-pointer h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <Store className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-xl">Founder Login</h3>
                    <p className="text-sm text-muted-foreground">
                      Founder access with full platform control
                    </p>
                    <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      Login as Founder
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Buyer Login */}
              <div className="bg-card border-2 border-secondary/20 rounded-lg p-6 hover:shadow-xl transition-all h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                    <UserPlus className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-xl">Buyer Login</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse bikes and contact sellers
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    Use buyer registration below
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Sections */}
        <BuyerRegistrationSection />
        <SellerRegistrationSection />

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center mb-12">Why Choose 2nd Bike Bajar?</h2>
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
      </div>
    );
  }

  // Full marketplace view for authenticated users
  return (
    <div>
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Why Choose 2nd Bike Bajar?</h2>
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

      {/* Available Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">Available Bikes</h2>
              <p className="text-muted-foreground">Browse bikes currently available for sale</p>
            </div>
          </div>
          
          {isAuthenticated && !isFounder && !profileCheckLoading && !isBuyerProfileComplete ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete your buyer profile to view bike listings. The profile setup form will appear automatically.
              </AlertDescription>
            </Alert>
          ) : isLoading || profileCheckLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : canViewListings && listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <BikeCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">No bikes available for sale yet.</p>
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
