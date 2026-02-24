import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListing } from '../hooks/useQueries';
import { useIsBuyerProfileComplete } from '../hooks/useBuyerProfile';
import { useIsFounder } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Calendar, Gauge, Phone } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

export default function BikeDetail() {
  const { id } = useParams({ from: '/bike/$id' });
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isFounder } = useIsFounder();
  const { data: isBuyerProfileComplete, isLoading: profileCheckLoading } = useIsBuyerProfileComplete();
  const { data: listing, isLoading, error } = useGetListing(id);

  const canViewListing = isAuthenticated && (isFounder || isBuyerProfileComplete);

  // Require login before viewing
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/listings' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-4">
            <p>Please log in to view bike details.</p>
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

  if (isAuthenticated && !isFounder && !profileCheckLoading && !isBuyerProfileComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/listings' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-4">
            <p>Please complete your buyer profile to view bike details.</p>
            <p className="text-sm text-muted-foreground">
              The profile setup form will appear automatically.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/listings' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load bike details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading || profileCheckLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing || !canViewListing) {
    return null;
  }

  const conditionColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    fair: 'bg-yellow-500'
  };

  const shareData = {
    id: listing.id,
    title: listing.title,
    brand: listing.brand,
    model: listing.model,
    price: listing.price
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/listings' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Listings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          <img
            src="/assets/generated/bike-placeholder.dim_400x300.png"
            alt={listing.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="font-display text-3xl font-bold">{listing.title}</h1>
              <Badge variant={listing.available ? 'default' : 'outline'}>
                {listing.available ? 'Available' : 'Sold'}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-primary">
              ₹{Number(listing.price).toLocaleString()}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Brand:</span>
                <span>{listing.brand}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Model:</span>
                <span>{listing.model}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">Year:</span>
                <span>{Number(listing.year)}</span>
              </div>
              {listing.mileage && (
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  <span className="font-semibold">Mileage:</span>
                  <span>{Number(listing.mileage).toLocaleString()} km</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold">Condition:</span>
                <Badge className={conditionColors[listing.condition]}>
                  {listing.condition}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Seller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="font-semibold">Contact:</span>
                <span>{listing.contactInfo}</span>
              </div>
              <Button className="w-full" size="lg">
                Send Message
              </Button>
            </CardContent>
          </Card>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">Share this listing</h3>
            <ShareButtons listing={shareData} variant="full" />
          </div>
        </div>
      </div>
    </div>
  );
}
