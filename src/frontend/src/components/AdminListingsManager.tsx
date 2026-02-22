import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteListing } from '../hooks/useQueries';
import type { BikeListing } from '../backend';
import EditListingDialog from './EditListingDialog';

interface AdminListingsManagerProps {
  listings: BikeListing[];
}

export default function AdminListingsManager({ listings }: AdminListingsManagerProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<BikeListing | null>(null);
  const deleteListing = useDeleteListing();

  const handleDeleteClick = (listing: BikeListing) => {
    setSelectedListing(listing);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (listing: BikeListing) => {
    setSelectedListing(listing);
    setEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedListing) return;

    try {
      await deleteListing.mutateAsync(selectedListing.id);
      toast.success('Listing deleted successfully!');
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing. Please try again.');
    }
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No listings found in the marketplace.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">{listing.title}</TableCell>
                <TableCell>{listing.brand}</TableCell>
                <TableCell>{listing.year.toString()}</TableCell>
                <TableCell>₹{listing.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={listing.available ? 'default' : 'secondary'}>
                    {listing.available ? 'Available' : 'Sold'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(listing)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(listing)}
                      disabled={deleteListing.isPending}
                    >
                      {deleteListing.isPending && selectedListing?.id === listing.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the listing "{selectedListing?.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedListing && (
        <EditListingDialog
          listing={selectedListing}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </>
  );
}
