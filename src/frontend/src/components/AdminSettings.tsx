import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Shield, Database } from 'lucide-react';
import FounderProfileEditor from './FounderProfileEditor';
import BuyersManagement from './BuyersManagement';
import AdminListingsManager from './AdminListingsManager';
import { useGetAllListings } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSettings() {
  const { data: listings, isLoading } = useGetAllListings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Settings & Configuration
          </CardTitle>
          <CardDescription>
            Manage platform settings, founder profile, and administrative controls
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Founder Profile
          </CardTitle>
          <CardDescription>Update founder information displayed on About Us page</CardDescription>
        </CardHeader>
        <CardContent>
          <FounderProfileEditor />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Buyer Profiles Management
          </CardTitle>
          <CardDescription>View and manage all buyer profiles with document verification</CardDescription>
        </CardHeader>
        <CardContent>
          <BuyersManagement />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            All Listings Management
          </CardTitle>
          <CardDescription>Complete control over all marketplace listings</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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
  );
}
