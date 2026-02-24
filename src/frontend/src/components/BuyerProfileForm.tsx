import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import {
  useCreateBuyerProfile,
  useUploadProfilePhoto,
  useUploadAadhaarDocument,
  useUploadPanDocument,
  useCompleteBuyerProfile,
} from '../hooks/useBuyerProfile';

export default function BuyerProfileForm() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [aadhaarDocFile, setAadhaarDocFile] = useState<File | null>(null);
  const [panDocFile, setPanDocFile] = useState<File | null>(null);
  
  const [uploadProgress, setUploadProgress] = useState({ profile: 0, aadhaar: 0, pan: 0 });

  const createProfile = useCreateBuyerProfile();
  const uploadProfilePhoto = useUploadProfilePhoto();
  const uploadAadhaarDoc = useUploadAadhaarDocument();
  const uploadPanDoc = useUploadPanDocument();
  const completeProfile = useCompleteBuyerProfile();

  const isSubmitting = createProfile.isPending || uploadProfilePhoto.isPending || 
                       uploadAadhaarDoc.isPending || uploadPanDoc.isPending || 
                       completeProfile.isPending;

  const handleFileChange = (type: 'profile' | 'aadhaar' | 'pan', file: File | null) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (type === 'profile') setProfilePhotoFile(file);
    else if (type === 'aadhaar') setAadhaarDocFile(file);
    else if (type === 'pan') setPanDocFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim() || !email.trim() || !address.trim() || 
        !aadhaarNumber.trim() || !panNumber.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!profilePhotoFile || !aadhaarDocFile || !panDocFile) {
      toast.error('Please upload all required documents');
      return;
    }

    try {
      // Step 1: Create buyer profile with text data
      await createProfile.mutateAsync({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        address: address.trim(),
        aadhaarNumber: aadhaarNumber.trim(),
        panNumber: panNumber.trim(),
      });

      // Step 2: Upload profile photo
      const profilePhotoBytes = new Uint8Array(await profilePhotoFile.arrayBuffer());
      const profileBlob = ExternalBlob.fromBytes(profilePhotoBytes).withUploadProgress((percentage) => {
        setUploadProgress(prev => ({ ...prev, profile: percentage }));
      });
      await uploadProfilePhoto.mutateAsync(profileBlob);

      // Step 3: Upload Aadhaar document
      const aadhaarBytes = new Uint8Array(await aadhaarDocFile.arrayBuffer());
      const aadhaarBlob = ExternalBlob.fromBytes(aadhaarBytes).withUploadProgress((percentage) => {
        setUploadProgress(prev => ({ ...prev, aadhaar: percentage }));
      });
      await uploadAadhaarDoc.mutateAsync(aadhaarBlob);

      // Step 4: Upload PAN document
      const panBytes = new Uint8Array(await panDocFile.arrayBuffer());
      const panBlob = ExternalBlob.fromBytes(panBytes).withUploadProgress((percentage) => {
        setUploadProgress(prev => ({ ...prev, pan: percentage }));
      });
      await uploadPanDoc.mutateAsync(panBlob);

      // Step 5: Mark profile as complete
      await completeProfile.mutateAsync();

      toast.success('Profile created successfully!');
    } catch (error: any) {
      console.error('Profile creation error:', error);
      toast.error('Failed to create profile: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address (City/State) *</Label>
        <Input
          id="address"
          placeholder="Enter your city and state"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
        <Input
          id="aadhaarNumber"
          placeholder="Enter your Aadhaar number"
          value={aadhaarNumber}
          onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
          maxLength={12}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="panNumber">PAN Number *</Label>
        <Input
          id="panNumber"
          placeholder="Enter your PAN number"
          value={panNumber}
          onChange={(e) => setPanNumber(e.target.value.toUpperCase().slice(0, 10))}
          maxLength={10}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profilePhoto">Profile Photo *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="profilePhoto"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileChange('profile', e.target.files?.[0] || null)}
            disabled={isSubmitting}
            required
          />
          {profilePhotoFile && <span className="text-sm text-green-600">✓</span>}
        </div>
        {uploadProgress.profile > 0 && uploadProgress.profile < 100 && (
          <p className="text-xs text-muted-foreground">Uploading: {uploadProgress.profile}%</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="aadhaarDoc">Aadhaar Document *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="aadhaarDoc"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileChange('aadhaar', e.target.files?.[0] || null)}
            disabled={isSubmitting}
            required
          />
          {aadhaarDocFile && <span className="text-sm text-green-600">✓</span>}
        </div>
        {uploadProgress.aadhaar > 0 && uploadProgress.aadhaar < 100 && (
          <p className="text-xs text-muted-foreground">Uploading: {uploadProgress.aadhaar}%</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="panDoc">PAN Document *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="panDoc"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileChange('pan', e.target.files?.[0] || null)}
            disabled={isSubmitting}
            required
          />
          {panDocFile && <span className="text-sm text-green-600">✓</span>}
        </div>
        {uploadProgress.pan > 0 && uploadProgress.pan < 100 && (
          <p className="text-xs text-muted-foreground">Uploading: {uploadProgress.pan}%</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Profile...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Complete Profile
          </>
        )}
      </Button>
    </form>
  );
}
