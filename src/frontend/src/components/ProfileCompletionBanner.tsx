import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsBuyerProfileComplete } from '../hooks/useBuyerProfile';
import { useIsFounder } from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ProfileCompletionBanner() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isFounder } = useIsFounder();
  const { data: isBuyerProfileComplete, isLoading } = useIsBuyerProfileComplete();

  // Only show banner when:
  // 1. User is authenticated
  // 2. User is not a founder
  // 3. Profile check is complete (not loading)
  // 4. Buyer profile is incomplete
  const showBanner = isAuthenticated && !isFounder && !isLoading && isBuyerProfileComplete === false;

  if (!showBanner) return null;

  return (
    <div className="border-b bg-warning/10">
      <div className="container mx-auto px-4 py-3">
        <Alert className="border-warning bg-transparent">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">
              Complete your buyer profile to access bike listings and full marketplace features.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
