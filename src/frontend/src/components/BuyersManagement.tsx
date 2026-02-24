import { useState } from 'react';
import { useGetAllBuyerProfiles } from '../hooks/useBuyerProfile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import type { BuyerProfile } from '../backend';

export default function BuyersManagement() {
  const { data: buyers, isLoading } = useGetAllBuyerProfiles();
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerProfile | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!buyers || buyers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No buyer profiles found.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Aadhaar</TableHead>
              <TableHead>PAN</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buyers.map((buyer, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{buyer.fullName}</TableCell>
                <TableCell>{buyer.email}</TableCell>
                <TableCell>{buyer.phoneNumber}</TableCell>
                <TableCell>{buyer.address}</TableCell>
                <TableCell className="font-mono text-xs">{buyer.aadhaarNumber}</TableCell>
                <TableCell className="font-mono text-xs">{buyer.panNumber}</TableCell>
                <TableCell>
                  {buyer.isProfileComplete ? (
                    <Badge variant="default">Complete</Badge>
                  ) : (
                    <Badge variant="outline">Incomplete</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBuyer(buyer)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={!!selectedBuyer} onOpenChange={() => setSelectedBuyer(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buyer Profile Details</DialogTitle>
          </DialogHeader>
          {selectedBuyer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base">{selectedBuyer.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedBuyer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p className="text-base">{selectedBuyer.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-base">{selectedBuyer.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aadhaar Number</p>
                  <p className="text-base font-mono">{selectedBuyer.aadhaarNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">PAN Number</p>
                  <p className="text-base font-mono">{selectedBuyer.panNumber}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Profile Photo</p>
                  {selectedBuyer.profilePhoto ? (
                    <img
                      src={selectedBuyer.profilePhoto.getDirectURL()}
                      alt="Profile"
                      className="max-w-xs rounded-lg border"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">No profile photo uploaded</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Aadhaar Document</p>
                  {selectedBuyer.aadhaarDocument ? (
                    <img
                      src={selectedBuyer.aadhaarDocument.getDirectURL()}
                      alt="Aadhaar Document"
                      className="max-w-md rounded-lg border"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">No Aadhaar document uploaded</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">PAN Document</p>
                  {selectedBuyer.panDocument ? (
                    <img
                      src={selectedBuyer.panDocument.getDirectURL()}
                      alt="PAN Document"
                      className="max-w-md rounded-lg border"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">No PAN document uploaded</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
