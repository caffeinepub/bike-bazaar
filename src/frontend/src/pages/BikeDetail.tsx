import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useGetListing } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Gauge, MessageCircle, DollarSign } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function BikeDetail() {
  const { id } = useParams({ from: '/listings/$id' });
  const navigate = useNavigate();
  const { data: listing, isLoading, error } = useGetListing(id);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const isOwner = isAuthenticated && listing && identity.getPrincipal().toString() === listing.seller.toString();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load listing. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Listing not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const conditionColors = {
    excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    fair: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate({ to: '/listings' })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Listings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src="/assets/generated/bike-placeholder.dim_400x300.png"
            alt={listing.title}
            className="w-full h-auto rounded-lg shadow-medium"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-muted-foreground text-lg">
              {listing.brand} {listing.model}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={conditionColors[listing.condition]}>
              {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
            </Badge>
            {!listing.available && (
              <Badge variant="outline">Sold</Badge>
            )}
          </div>

          <div className="text-4xl font-bold text-primary">
            ${Number(listing.price).toLocaleString()}
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-semibold">{Number(listing.year)}</p>
                  </div>
                </div>
                {listing.mileage && (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-semibold">{Number(listing.mileage).toLocaleString()} km</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </div>

          {isAuthenticated && !isOwner && listing.available && (
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => navigate({ to: '/messages/$listingId', params: { listingId: listing.id } })}
            >
              <MessageCircle className="h-5 w-5" />
              Contact Seller
            </Button>
          )}

          {!isAuthenticated && (
            <Alert>
              <AlertDescription>
                Please log in to contact the seller.
              </AlertDescription>
            </Alert>
          )}

          {isOwner && (
            <Alert>
              <AlertDescription>
                This is your listing. You can manage it from your{' '}
                <Link to="/my-listings" className="text-primary hover:underline">
                  My Listings
                </Link>{' '}
                page.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
