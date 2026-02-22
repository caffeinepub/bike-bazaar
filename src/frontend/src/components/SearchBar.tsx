import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useMemo } from 'react';
import { debounce } from '../lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const debouncedOnChange = useMemo(
    () => debounce((val: string) => onChange(val), 300),
    [onChange]
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search bikes..."
        defaultValue={value}
        onChange={(e) => debouncedOnChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
