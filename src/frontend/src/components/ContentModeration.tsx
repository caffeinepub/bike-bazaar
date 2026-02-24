import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetAllListings, useUpdateListing, useDeleteListing } from '../hooks/useQueries';
import { FileText, CheckCircle, XCircle, Flag, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import type { BikeListing } from '../backend';

export default function ContentModeration() {
  const { data: listings, isLoading } = useGetAllListings();
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();
  const [selectedListing, setSelectedListing] = useState<BikeListing | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleToggleAvailability = async (listing: BikeListing) => {
    try {
      await updateListing.mutateAsync({
        id: listing.id,
        title: listing.title,
        brand: listing.brand,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        mileage: listing.mileage || null,
        condition: listing.condition,
        description: listing.description,
        contactInfo: listing.contactInfo,
        available: !listing.available,
      });
      toast.success(listing.available ? 'Listing deactivated' : 'Listing activated');
    } catch (error) {
      toast.error('Failed to update listing');
      console.error(error);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteListing.mutateAsync(listingId);
      toast.success('Listing deleted successfully');
      setViewDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete listing');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeListings = listings?.filter(l => l.available) || [];
  const inactiveListings = listings?.filter(l => !l.available) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Moderation
          </CardTitle>
          <CardDescription>
            Review, approve, and manage all bike listings on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Active ({activeListings.length})
              </TabsTrigger>
              <TabsTrigger value="inactive" className="gap-2">
                <XCircle className="h-4 w-4" />
                Inactive ({inactiveListings.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                <FileText className="h-4 w-4" />
                All ({listings?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <ListingsTable
                listings={activeListings}
                onView={(listing) => {
                  setSelectedListing(listing);
                  setViewDialogOpen(true);
                }}
                onToggle={handleToggleAvailability}
                onDelete={handleDeleteListing}
              />
            </TabsContent>

            <TabsContent value="inactive" className="space-y-4">
              <ListingsTable
                listings={inactiveListings}
                onView={(listing) => {
                  setSelectedListing(listing);
                  setViewDialogOpen(true);
                }}
                onToggle={handleToggleAvailability}
                onDelete={handleDeleteListing}
              />
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <ListingsTable
                listings={listings || []}
                onView={(listing) => {
                  setSelectedListing(listing);
                  setViewDialogOpen(true);
                }}
                onToggle={handleToggleAvailability}
                onDelete={handleDeleteListing}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
            <DialogDescription>Review complete listing information</DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <p className="font-semibold">{selectedListing.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div>
                    <Badge variant={selectedListing.available ? 'default' : 'secondary'}>
                      {selectedListing.available ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Brand</label>
                  <p>{selectedListing.brand}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Model</label>
                  <p>{selectedListing.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Year</label>
                  <p>{selectedListing.year.toString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <p className="font-semibold">₹{selectedListing.price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Condition</label>
                  <Badge variant="outline">{selectedListing.condition}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Listed</label>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(Number(selectedListing.listingDate) / 1000000), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1">{selectedListing.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedListing.available ? 'outline' : 'default'}
                  onClick={() => handleToggleAvailability(selectedListing)}
                  className="flex-1"
                >
                  {selectedListing.available ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteListing(selectedListing.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ListingsTable({
  listings,
  onView,
  onToggle,
  onDelete,
}: {
  listings: BikeListing[];
  onView: (listing: BikeListing) => void;
  onToggle: (listing: BikeListing) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Listed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.length > 0 ? (
            listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">{listing.title}</TableCell>
                <TableCell>{listing.brand}</TableCell>
                <TableCell>₹{listing.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={listing.available ? 'default' : 'secondary'}>
                    {listing.available ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(Number(listing.listingDate) / 1000000), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(listing)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggle(listing)}
                    >
                      {listing.available ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                No listings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
