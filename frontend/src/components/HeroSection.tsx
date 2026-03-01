import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Car } from '../backend';
import { formatPrice, getCarImageUrl } from '../lib/utils';

interface HeroSectionProps {
  featuredCars: Car[];
  isLoading: boolean;
}

function isEVCar(car: Car): boolean {
  if (typeof car.carType === 'string') return car.carType === 'ev';
  return (car.carType as unknown as { ev?: unknown })?.ev !== undefined;
}

export function HeroSection({ featuredCars, isLoading }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (featuredCars.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex(i => (i + 1) % featuredCars.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredCars.length]);

  if (isLoading) {
    return (
      <section className="relative h-[70vh] min-h-[500px] bg-secondary animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground font-heading text-xl uppercase tracking-widest">Loading Featured Cars…</div>
      </section>
    );
  }

  if (featuredCars.length === 0) {
    return (
      <section
        className="relative h-[70vh] min-h-[500px] flex items-center"
        style={{
          backgroundImage: 'url(/assets/generated/hero-banner.dim_1920x800.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-up">
          <div className="max-w-2xl">
            <p className="text-auto-red font-heading text-sm font-bold uppercase tracking-widest mb-3">India's #1 Automotive Portal</p>
            <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight text-white mb-4 leading-none">
              Upcoming<br /><span className="text-auto-red">Cars</span> 2026
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-lg">
              Discover the latest EV and petrol cars launching in India. Specs, prices, and launch dates — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/cars" className="btn-auto-primary flex items-center gap-2">
                Explore Cars <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/compare" className="px-6 py-2.5 border border-white/30 text-white font-heading font-semibold uppercase tracking-wider rounded hover:border-auto-red hover:text-auto-red transition-all text-sm">
                Compare Cars
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const activeCar = featuredCars[activeIndex];
  const carImageUrl = getCarImageUrl(activeCar.images);
  const isEV = isEVCar(activeCar);

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `url(${carImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 hero-gradient" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, oklch(0.08 0 0 / 80%) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <span className={isEV ? 'type-badge-ev' : 'type-badge-petrol'}>
                {isEV ? '⚡ Electric' : '⛽ Petrol'}
              </span>
              <span className="text-white/60 text-sm font-semibold">{activeCar.brand}</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight text-white mb-3 leading-none">
              {activeCar.name}
            </h1>
            <p className="text-2xl font-heading font-bold text-auto-red mb-6">
              {formatPrice(activeCar.expectedPriceInr)}
              <span className="text-base text-white/60 font-normal ml-2">expected</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/cars/$carId"
                params={{ carId: activeCar.id.toString() }}
                className="btn-auto-primary flex items-center gap-2"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/compare" className="px-6 py-2.5 border border-white/30 text-white font-heading font-semibold uppercase tracking-wider rounded hover:border-auto-red hover:text-auto-red transition-all text-sm">
                Compare
              </Link>
            </div>
          </div>
        </div>
      </div>

      {featuredCars.length > 1 && (
        <>
          <button
            onClick={() => setActiveIndex(i => (i - 1 + featuredCars.length) % featuredCars.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-auto-red transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setActiveIndex(i => (i + 1) % featuredCars.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-auto-red transition-all"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {featuredCars.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-8 bg-auto-red' : 'w-2 bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
