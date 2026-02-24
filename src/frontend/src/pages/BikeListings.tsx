import { useState, useMemo } from 'react';
import { useGetAvailableListings } from '../hooks/useQueries';
import { useIsBuyerProfileComplete } from '../hooks/useBuyerProfile';
import { useIsFounder } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import BikeCard from '../components/BikeCard';
import SearchBar from '../components/SearchBar';
import BikeFilters from '../components/BikeFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { BikeListing, Condition } from '../backend';

export interface FilterState {
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  condition: Condition | 'all';
  brand: string;
}

export default function BikeListings() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isFounder } = useIsFounder();
  const { data: isBuyerProfileComplete, isLoading: profileCheckLoading } = useIsBuyerProfileComplete();
  const { data: listings, isLoading, error } = useGetAvailableListings();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    condition: 'all',
    brand: ''
  });

  const canViewListings = isAuthenticated && (isFounder || isBuyerProfileComplete);

  const filteredListings = useMemo(() => {
    if (!listings) return [];

    return listings.filter((listing) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        listing.title.toLowerCase().includes(searchLower) ||
        listing.brand.toLowerCase().includes(searchLower) ||
        listing.model.toLowerCase().includes(searchLower);

      // Price filter
      const price = Number(listing.price);
      const minPrice = filters.minPrice ? Number(filters.minPrice) : 0;
      const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
      const matchesPrice = price >= minPrice && price <= maxPrice;

      // Year filter
      const year = Number(listing.year);
      const minYear = filters.minYear ? Number(filters.minYear) : 0;
      const maxYear = filters.maxYear ? Number(filters.maxYear) : Infinity;
      const matchesYear = year >= minYear && year <= maxYear;

      // Condition filter
      const matchesCondition = filters.condition === 'all' || listing.condition === filters.condition;

      // Brand filter
      const matchesBrand = !filters.brand || listing.brand.toLowerCase().includes(filters.brand.toLowerCase());

      return matchesSearch && matchesPrice && matchesYear && matchesCondition && matchesBrand;
    });
  }, [listings, searchQuery, filters]);

  // Require login before viewing
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl font-bold mb-8">Browse Bikes</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-4">
            <p>Please log in to view bike listings.</p>
            <div>
              <Button 
                onClick={() => login()} 
                disabled={loginStatus === 'logging-in'}
              >
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Continue'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load listings. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isAuthenticated && !isFounder && !profileCheckLoading && !isBuyerProfileComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl font-bold mb-8">Browse Bikes</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-4">
            <p>Please complete your buyer profile to view bike listings.</p>
            <p className="text-sm text-muted-foreground">
              The profile setup form will appear automatically. You need to provide your details and upload required documents to access the marketplace.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold mb-8">Browse Bikes</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <BikeFilters filters={filters} onFiltersChange={setFilters} />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Results Count */}
          {!isLoading && canViewListings && (
            <p className="text-sm text-muted-foreground mb-4">
              {filteredListings.length} {filteredListings.length === 1 ? 'bike' : 'bikes'} found
            </p>
          )}

          {/* Listings Grid */}
          {isLoading || profileCheckLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : canViewListings && filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <BikeCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : canViewListings ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No bikes match your search criteria.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
