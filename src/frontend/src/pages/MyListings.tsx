import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyListings, useDeleteListing, useUpdateListing } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Trash2, Edit, Eye } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function MyListings() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: listings, isLoading, error } = useGetMyListings();
  const { mutate: deleteListing } = useDeleteListing();
  const { mutate: updateListing } = useUpdateListing();

  const handleDelete = (id: string) => {
    deleteListing(id, {
      onSuccess: () => {
        toast.success('Listing deleted successfully');
      },
      onError: (error) => {
        toast.error('Failed to delete listing: ' + error.message);
      }
    });
  };

  const handleToggleAvailability = (listing: any) => {
    updateListing(
      {
        id: listing.id,
        title: listing.title,
        brand: listing.brand,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        mileage: listing.mileage,
        condition: listing.condition,
        description: listing.description,
        contactInfo: listing.contactInfo,
        available: !listing.available
      },
      {
        onSuccess: () => {
          toast.success(`Listing marked as ${!listing.available ? 'available' : 'sold'}`);
        },
        onError: (error) => {
          toast.error('Failed to update listing: ' + error.message);
        }
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view your listings.
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
            Failed to load your listings. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-bold">My Listings</h1>
        <Link to="/sell">
          <Button>Create New Listing</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                  <Badge variant={listing.available ? 'default' : 'outline'}>
                    {listing.available ? 'Available' : 'Sold'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <img
                  src="/assets/generated/bike-placeholder.dim_400x300.png"
                  alt={listing.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">
                    ${Number(listing.price).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {listing.brand} {listing.model} • {Number(listing.year)}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link to="/listings/$id" params={{ id: listing.id }} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleAvailability(listing)}
                >
                  {listing.available ? 'Mark Sold' : 'Mark Available'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this listing? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(listing.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't created any listings yet.</p>
          <Link to="/sell">
            <Button>Create Your First Listing</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
