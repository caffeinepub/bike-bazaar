import { useState, useMemo } from 'react';
import { useGetAvailableListings } from '../hooks/useQueries';
import BikeCard from '../components/BikeCard';
import SearchBar from '../components/SearchBar';
import BikeFilters from '../components/BikeFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold mb-8">Browse Bikes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <BikeFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredListings.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filteredListings.length} {filteredListings.length === 1 ? 'bike' : 'bikes'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <BikeCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bikes match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
