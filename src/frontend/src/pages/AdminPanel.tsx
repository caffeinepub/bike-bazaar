import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useIsFounder, useGetAllListings } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import FounderProfileEditor from '../components/FounderProfileEditor';
import AdminListingsManager from '../components/AdminListingsManager';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isFounder, isLoading: isCheckingFounder } = useIsFounder();
  const { data: listings, isLoading: isLoadingListings } = useGetAllListings();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  if (isCheckingFounder) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isFounder) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Access Denied: You do not have permission to access the admin panel.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your marketplace and founder profile</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Founder Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <FounderProfileEditor />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage All Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingListings ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <AdminListingsManager listings={listings || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
