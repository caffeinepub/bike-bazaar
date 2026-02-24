import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useUpdateFounderProfile } from '../hooks/useQueries';
import type { FounderProfile } from '../backend';

export default function FounderProfileEditor() {
  const updateProfile = useUpdateFounderProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Default founder profile values
  const defaultProfile: FounderProfile = {
    name: 'Anuj Saha',
    address: 'Bijapur, Chhattisgarh',
    contactNumber: '7828226397',
    emailAddress: 'rohitmarpalli@gmail.com',
    instagramProfile: 'https://www.instagram.com/annujj_03_?igsh=MXdocnV1bjF0bDR6bQ==',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FounderProfile>({
    defaultValues: defaultProfile,
  });

  useEffect(() => {
    reset(defaultProfile);
  }, [reset]);

  const onSubmit = async (data: FounderProfile) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Founder profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating founder profile:', error);
      toast.error('Failed to update founder profile. Please try again.');
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-base">{defaultProfile.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p className="text-base">{defaultProfile.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
            <p className="text-base">{defaultProfile.contactNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-base">{defaultProfile.emailAddress}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Instagram Profile</p>
            <p className="text-base truncate">{defaultProfile.instagramProfile}</p>
          </div>
        </div>
        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            {...register('address', { required: 'Address is required' })}
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            {...register('contactNumber', {
              required: 'Contact number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit phone number',
              },
            })}
            placeholder="Enter 10-digit phone number"
          />
          {errors.contactNumber && (
            <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailAddress">Email Address *</Label>
          <Input
            id="emailAddress"
            type="email"
            {...register('emailAddress', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            })}
            placeholder="Enter your email"
          />
          {errors.emailAddress && (
            <p className="text-sm text-destructive">{errors.emailAddress.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="instagramProfile">Instagram Profile URL *</Label>
          <Input
            id="instagramProfile"
            {...register('instagramProfile', {
              required: 'Instagram profile URL is required',
            })}
            placeholder="https://www.instagram.com/username"
          />
          {errors.instagramProfile && (
            <p className="text-sm text-destructive">{errors.instagramProfile.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsEditing(false);
            reset();
          }}
          disabled={updateProfile.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
