import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllBuyerProfiles } from '../hooks/useBuyerProfile';
import { Search, Edit, User } from 'lucide-react';

export default function UsersManagement() {
  const { data: buyerProfiles, isLoading: buyersLoading } = useGetAllBuyerProfiles();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const isLoading = buyersLoading;

  const filteredProfiles = buyerProfiles?.filter((profile) =>
    profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            View and manage all registered users and monitor user activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles && filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{profile.fullName}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>{profile.phoneNumber}</TableCell>
                      <TableCell>
                        {profile.isProfileComplete ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Incomplete</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(profile)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>
                                View user profile information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input value={profile.fullName} disabled />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input value={profile.email} disabled />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input value={profile.phoneNumber} disabled />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Address</label>
                                <Input value={profile.address} disabled />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Profile Status</label>
                                <Badge variant={profile.isProfileComplete ? 'default' : 'secondary'}>
                                  {profile.isProfileComplete ? 'Complete' : 'Incomplete'}
                                </Badge>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Total Users: {buyerProfiles?.length || 0}</p>
            <p>Active Users: {buyerProfiles?.filter(p => p.isProfileComplete).length || 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
