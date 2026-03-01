import React from 'react';
import { Car } from '../backend';
import { CarCard } from './CarCard';
import { Skeleton } from '@/components/ui/skeleton';

interface TrendingCarsGridProps {
  cars: Car[];
  isLoading: boolean;
}

export function TrendingCarsGrid({ cars, isLoading }: TrendingCarsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[16/10] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="font-heading text-lg uppercase">No trending cars yet</p>
        <p className="text-sm mt-1">Check back soon for trending vehicles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {cars.map((car) => (
        <CarCard key={car.id.toString()} car={car} />
      ))}
    </div>
  );
}
