import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import {
  Calendar, IndianRupee, Gauge, Zap, Fuel, Shield,
  CheckCircle, XCircle, Star, ArrowLeft, Loader2
} from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { StarRatingWidget } from '../components/StarRatingWidget';
import { SocialShareButtons } from '../components/SocialShareButtons';
import { useGetCar } from '../hooks/useQueries';
import { formatPrice, formatLaunchDate } from '../lib/utils';

function isEVCar(carType: unknown): boolean {
  if (typeof carType === 'string') return carType === 'ev';
  return (carType as { ev?: unknown })?.ev !== undefined;
}

export function CarDetailPage() {
  const { carId } = useParams({ from: '/cars/$carId' });
  const carIdBigInt = carId ? BigInt(carId) : null;
  const { data: car, isLoading, error } = useGetCar(carIdBigInt);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-auto-red" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-heading text-xl uppercase">Car not found</p>
        <Link to="/cars" className="btn-auto-primary">Browse Cars</Link>
      </div>
    );
  }

  const isEV = isEVCar(car.carType);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link to="/cars" className="hover:text-foreground transition-colors">Cars</Link>
        <span>/</span>
        <span className="text-foreground">{car.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Gallery */}
        <div>
          <ImageGallery images={car.images} altPrefix={car.name} />
        </div>

        {/* Key Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={isEV ? 'type-badge-ev' : 'type-badge-petrol'}>
                {isEV ? '⚡ Electric' : '⛽ Petrol'}
              </span>
              <span className="text-sm text-muted-foreground font-semibold">{car.brand}</span>
            </div>
            <h1 className="font-heading text-4xl font-bold uppercase tracking-wide mb-2">{car.name}</h1>
            <p className="text-3xl font-heading font-bold text-auto-red">
              {formatPrice(car.expectedPriceInr)}
              <span className="text-base text-muted-foreground font-normal ml-2">expected price</span>
            </p>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Calendar className="w-3.5 h-3.5 text-auto-red" />
                <span className="uppercase font-bold tracking-wider">Launch Date</span>
              </div>
              <p className="font-semibold text-sm">{formatLaunchDate(car.expectedLaunchDate)}</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Gauge className="w-3.5 h-3.5 text-auto-red" />
                <span className="uppercase font-bold tracking-wider">Top Speed</span>
              </div>
              <p className="font-semibold text-sm">{car.topSpeed.toString()} km/h</p>
            </div>
            {isEV ? (
              <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Zap className="w-3.5 h-3.5 text-auto-red" />
                  <span className="uppercase font-bold tracking-wider">Range</span>
                </div>
                <p className="font-semibold text-sm">{car.range.toString()} km</p>
              </div>
            ) : (
              <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Fuel className="w-3.5 h-3.5 text-auto-red" />
                  <span className="uppercase font-bold tracking-wider">Mileage</span>
                </div>
                <p className="font-semibold text-sm">{car.mileage.toString()} kmpl</p>
              </div>
            )}
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-auto-red" />
                <span className="uppercase font-bold tracking-wider">Price</span>
              </div>
              <p className="font-semibold text-sm">{formatPrice(car.expectedPriceInr)}</p>
            </div>
          </div>

          {/* Engine/Battery */}
          {car.engineOrBatterySpecs && (
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-1 text-auto-red">
                {isEV ? 'Battery Specs' : 'Engine Specs'}
              </h3>
              <p className="text-sm">{car.engineOrBatterySpecs}</p>
            </div>
          )}

          {/* Social Share */}
          <SocialShareButtons url={shareUrl} title={`Check out the ${car.brand} ${car.name} on UpcomingCars!`} />

          {/* Compare CTA */}
          <Link to="/compare" className="btn-auto-primary inline-flex items-center gap-2 text-sm">
            Compare with another car
          </Link>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Features */}
          {(car.interiorFeatures.length > 0 || car.exteriorFeatures.length > 0) && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide mb-4">Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {car.interiorFeatures.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-auto-red mb-2">Interior</h4>
                    <ul className="space-y-1">
                      {car.interiorFeatures.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {car.exteriorFeatures.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-auto-red mb-2">Exterior</h4>
                    <ul className="space-y-1">
                      {car.exteriorFeatures.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Safety */}
          {car.safetyFeatures.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-auto-red" /> Safety Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {car.safetyFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          {(car.pros.length > 0 || car.cons.length > 0) && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide mb-4">Pros &amp; Cons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {car.pros.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-green-500 mb-2">Pros</h4>
                    <ul className="space-y-1.5">
                      {car.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {car.cons.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-destructive mb-2">Cons</h4>
                    <ul className="space-y-1.5">
                      {car.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expert Review */}
          {car.expertReview && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-auto-red" /> Expert Review
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{car.expertReview}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <StarRatingWidget />
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3 text-auto-red">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/compare" className="w-full btn-auto-primary block text-center text-sm">
                Compare Cars
              </Link>
              <Link to="/cars" className="w-full block text-center py-2.5 border border-border rounded font-heading font-semibold uppercase tracking-wider text-sm hover:border-auto-red transition-all">
                Browse More Cars
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
