import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useUpdateListing } from '../hooks/useQueries';
import type { BikeListing, Condition } from '../backend';

interface EditListingDialogProps {
  listing: BikeListing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  title: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  condition: Condition;
  description: string;
  contactInfo: string;
  available: boolean;
}

export default function EditListingDialog({ listing, open, onOpenChange }: EditListingDialogProps) {
  const updateListing = useUpdateListing();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const condition = watch('condition');
  const available = watch('available');

  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        brand: listing.brand,
        model: listing.model,
        year: listing.year.toString(),
        price: listing.price.toString(),
        mileage: listing.mileage?.toString() || '',
        condition: listing.condition,
        description: listing.description,
        contactInfo: listing.contactInfo,
        available: listing.available,
      });
    }
  }, [listing, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateListing.mutateAsync({
        id: listing.id,
        title: data.title,
        brand: data.brand,
        model: data.model,
        year: BigInt(data.year),
        price: BigInt(data.price),
        mileage: data.mileage ? BigInt(data.mileage) : null,
        condition: data.condition,
        description: data.description,
        contactInfo: data.contactInfo,
        available: data.available,
      });
      toast.success('Listing updated successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g., Honda Activa 5G"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                {...register('brand', { required: 'Brand is required' })}
                placeholder="e.g., Honda"
              />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                {...register('model', { required: 'Model is required' })}
                placeholder="e.g., Activa 5G"
              />
              {errors.model && (
                <p className="text-sm text-destructive">{errors.model.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                {...register('year', {
                  required: 'Year is required',
                  min: { value: 1900, message: 'Year must be after 1900' },
                  max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' },
                })}
                placeholder="e.g., 2020"
              />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 1, message: 'Price must be greater than 0' },
                })}
                placeholder="e.g., 45000"
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                {...register('mileage')}
                placeholder="e.g., 15000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select
                value={condition}
                onValueChange={(value) => setValue('condition', value as Condition)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Info *</Label>
              <Input
                id="contactInfo"
                {...register('contactInfo', { required: 'Contact info is required' })}
                placeholder="Phone number or email"
              />
              {errors.contactInfo && (
                <p className="text-sm text-destructive">{errors.contactInfo.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe the bike's condition, features, and any additional details..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={available}
              onCheckedChange={(checked) => setValue('available', checked)}
            />
            <Label htmlFor="available">Available for sale</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={updateListing.isPending}>
              {updateListing.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateListing.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
