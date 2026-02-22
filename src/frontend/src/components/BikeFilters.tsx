import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';
import type { FilterState } from '../pages/BikeListings';
import { Condition } from '../backend';

interface BikeFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function BikeFilters({ filters, onFiltersChange }: BikeFiltersProps) {
  const handleClearFilters = () => {
    onFiltersChange({
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      condition: 'all',
      brand: ''
    });
  };

  const hasActiveFilters = 
    filters.minPrice || 
    filters.maxPrice || 
    filters.minYear || 
    filters.maxYear || 
    filters.condition !== 'all' || 
    filters.brand;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="gap-2 h-8"
            >
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
              min="0"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
              min="0"
            />
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Year Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minYear}
              onChange={(e) => onFiltersChange({ ...filters, minYear: e.target.value })}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxYear}
              onChange={(e) => onFiltersChange({ ...filters, maxYear: e.target.value })}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Condition</Label>
          <Select
            value={filters.condition}
            onValueChange={(value) => onFiltersChange({ ...filters, condition: value as Condition | 'all' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-semibold">Brand</Label>
          <Input
            id="brand"
            type="text"
            placeholder="e.g., Honda"
            value={filters.brand}
            onChange={(e) => onFiltersChange({ ...filters, brand: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
