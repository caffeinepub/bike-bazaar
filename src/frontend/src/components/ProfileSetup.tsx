import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { useIsBuyerProfileComplete } from '../hooks/useBuyerProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import BuyerProfileForm from './BuyerProfileForm';

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isBuyerProfileComplete, isLoading: buyerProfileLoading } = useIsBuyerProfileComplete();
  const { mutate: saveProfile, isPending: isSaving } = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [showBuyerProfileForm, setShowBuyerProfileForm] = useState(false);

  const showUserProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showBuyerProfileSetup = isAuthenticated && userProfile !== null && !buyerProfileLoading && isBuyerProfileComplete === false;

  const handleUserProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !contactInfo.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    saveProfile(
      { name: name.trim(), contactInfo: contactInfo.trim() },
      {
        onSuccess: () => {
          toast.success('User profile created successfully!');
          setName('');
          setContactInfo('');
          setShowBuyerProfileForm(true);
        },
        onError: (error) => {
          toast.error('Failed to create profile: ' + error.message);
        }
      }
    );
  };

  return (
    <>
      {/* User Profile Setup Modal */}
      <Dialog open={showUserProfileSetup} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Welcome to 2nd Bike Bajar!</DialogTitle>
            <DialogDescription>
              Please set up your basic profile to continue.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSaving}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                placeholder="Email or phone number"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                disabled={isSaving}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Buyer Profile Setup Modal */}
      <Dialog open={showBuyerProfileSetup || showBuyerProfileForm} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Complete Your Buyer Profile</DialogTitle>
            <DialogDescription>
              To access bike listings, please complete your buyer profile with all required information and documents.
            </DialogDescription>
          </DialogHeader>
          <BuyerProfileForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
