import React from 'react';
import { Link } from '@tanstack/react-router';
import { Calendar, IndianRupee, Gauge } from 'lucide-react';
import { Car } from '../backend';
import { formatPrice, formatLaunchDate, getCarImageUrl } from '../lib/utils';

interface CarCardProps {
  car: Car;
}

function isEVCar(car: Car): boolean {
  if (typeof car.carType === 'string') return car.carType === 'ev';
  return (car.carType as unknown as { ev?: unknown })?.ev !== undefined;
}

export function CarCard({ car }: CarCardProps) {
  const imageUrl = getCarImageUrl(car.images);
  const isEV = isEVCar(car);

  return (
    <Link to="/cars/$carId" params={{ carId: car.id.toString() }} className="block group">
      <div className="auto-card card-shine h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/10] bg-secondary">
          <img
            src={imageUrl}
            alt={car.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/generated/car-placeholder.dim_800x500.png';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className={isEV ? 'type-badge-ev' : 'type-badge-petrol'}>
              {isEV ? '⚡ EV' : '⛽ Petrol'}
            </span>
          </div>
          {car.isTrending && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-auto-red text-white">
                🔥 Trending
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{car.brand}</p>
          <h3 className="font-heading text-lg font-bold uppercase tracking-wide mb-3 group-hover:text-auto-red transition-colors line-clamp-1">
            {car.name}
          </h3>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IndianRupee className="w-3.5 h-3.5 text-auto-red flex-shrink-0" />
              <span className="font-semibold text-foreground">{formatPrice(car.expectedPriceInr)}</span>
              <span className="text-xs">expected</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-auto-red flex-shrink-0" />
              <span>{formatLaunchDate(car.expectedLaunchDate)}</span>
            </div>
            {isEV && car.range > 0n ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="w-3.5 h-3.5 text-auto-red flex-shrink-0" />
                <span>{car.range.toString()} km range</span>
              </div>
            ) : !isEV && car.mileage > 0n ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="w-3.5 h-3.5 text-auto-red flex-shrink-0" />
                <span>{car.mileage.toString()} kmpl</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
