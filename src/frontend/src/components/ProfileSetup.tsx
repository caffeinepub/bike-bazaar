import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending: isSaving } = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !contactInfo.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    saveProfile(
      { name: name.trim(), contactInfo: contactInfo.trim() },
      {
        onSuccess: () => {
          toast.success('Profile created successfully!');
          setName('');
          setContactInfo('');
        },
        onError: (error) => {
          toast.error('Failed to create profile: ' + error.message);
        }
      }
    );
  };

  return (
    <Dialog open={showProfileSetup} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Bike Bazaar!</DialogTitle>
          <DialogDescription>
            Please set up your profile to start buying and selling bikes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              'Create Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
