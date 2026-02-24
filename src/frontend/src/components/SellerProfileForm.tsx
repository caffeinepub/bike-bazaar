import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Store } from 'lucide-react';
import { toast } from 'sonner';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';

interface SellerProfileFormProps {
  onSuccess?: () => void;
}

export default function SellerProfileForm({ onSuccess }: SellerProfileFormProps) {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState('');
  const [businessDetails, setBusinessDetails] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopName.trim() || shopName.trim().length < 3) {
      toast.error('Shop name must be at least 3 characters');
      return;
    }

    if (!businessDetails.trim() || businessDetails.trim().length < 20) {
      toast.error('Business details must be at least 20 characters');
      return;
    }

    if (!contactInfo.trim()) {
      toast.error('Contact information is required');
      return;
    }

    // Save seller profile as user profile with shop name and business details
    const profileData = {
      name: shopName.trim(),
      contactInfo: `${contactInfo.trim()} | ${businessDetails.trim()}`,
    };

    saveProfile(profileData, {
      onSuccess: () => {
        toast.success('Seller profile created successfully!');
        if (onSuccess) {
          onSuccess();
        }
        setTimeout(() => {
          navigate({ to: '/my-listings' });
        }, 1000);
      },
      onError: (error) => {
        toast.error('Failed to create seller profile: ' + error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="shopName">Shop Name *</Label>
        <Input
          id="shopName"
          placeholder="Enter your shop or business name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          disabled={isPending}
          minLength={3}
          maxLength={100}
          required
        />
        <p className="text-xs text-muted-foreground">
          Minimum 3 characters, maximum 100 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactInfo">Contact Information *</Label>
        <Input
          id="contactInfo"
          type="text"
          placeholder="Phone number or email"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessDetails">Business Details *</Label>
        <Textarea
          id="businessDetails"
          placeholder="Describe your business, location, years of experience, specialties, etc."
          value={businessDetails}
          onChange={(e) => setBusinessDetails(e.target.value)}
          disabled={isPending}
          minLength={20}
          maxLength={500}
          rows={5}
          required
        />
        <p className="text-xs text-muted-foreground">
          Minimum 20 characters, maximum 500 characters. Include details about your business location, experience, and what makes your shop unique.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Seller Profile...
          </>
        ) : (
          <>
            <Store className="mr-2 h-4 w-4" />
            Complete Registration
          </>
        )}
      </Button>
    </form>
  );
}
