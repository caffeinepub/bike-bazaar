import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gauge, Share2 } from 'lucide-react';
import type { BikeListing } from '../backend';
import ShareButtons from './ShareButtons';
import { Separator } from '@/components/ui/separator';

interface BikeCardProps {
  listing: BikeListing;
}

export default function BikeCard({ listing }: BikeCardProps) {
  const conditionColors = {
    excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    fair: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  const shareData = {
    id: listing.id,
    title: listing.title,
    brand: listing.brand,
    model: listing.model,
    price: listing.price
  };

  return (
    <Card className="overflow-hidden card-hover h-full flex flex-col">
      <Link to="/bike/$id" params={{ id: listing.id }} className="flex-1">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src="/assets/generated/bike-placeholder.dim_400x300.png"
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="pt-4 flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
            <Badge className={conditionColors[listing.condition]} variant="outline">
              {listing.condition}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {listing.brand} {listing.model}
          </p>
          <p className="text-2xl font-bold text-primary mb-3">
            ₹{Number(listing.price).toLocaleString()}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{Number(listing.year)}</span>
            </div>
            {listing.mileage && (
              <div className="flex items-center gap-1">
                <Gauge className="h-4 w-4" />
                <span>{Number(listing.mileage).toLocaleString()} km</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="pt-0 pb-4 px-4">
        <div className="w-full">
          <Separator className="mb-3" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              Share
            </span>
            <ShareButtons listing={shareData} variant="compact" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
