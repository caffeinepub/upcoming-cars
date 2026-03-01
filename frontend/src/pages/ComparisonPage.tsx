import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeftRight, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { CarSelector } from '../components/CarSelector';
import { useGetAllCars, useGetCarComparison } from '../hooks/useQueries';
import { Car } from '../backend';
import { formatPrice, formatLaunchDate, getCarImageUrl } from '../lib/utils';

function isEVCar(car: Car): boolean {
  if (typeof car.carType === 'string') return car.carType === 'ev';
  return (car.carType as unknown as { ev?: unknown })?.ev !== undefined;
}

function WinBadge({ wins }: { wins: boolean }) {
  if (!wins) return null;
  return <span className="ml-1 text-xs bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded font-bold">✓ Better</span>;
}

export function ComparisonPage() {
  const [car1, setCar1] = useState<Car | null>(null);
  const [car2, setCar2] = useState<Car | null>(null);

  const { data: allCars = [], isLoading: carsLoading } = useGetAllCars();
  const { data: comparison, isLoading: compLoading } = useGetCarComparison(
    car1?.id ?? null,
    car2?.id ?? null
  );

  const c1 = comparison?.car1 ?? car1;
  const c2 = comparison?.car2 ?? car2;

  const rows: Array<{
    label: string;
    getValue: (c: Car) => string;
    compare?: (c1: Car, c2: Car) => { c1Wins: boolean; c2Wins: boolean };
  }> = [
    { label: 'Brand', getValue: c => c.brand },
    { label: 'Type', getValue: c => isEVCar(c) ? '⚡ Electric' : '⛽ Petrol' },
    {
      label: 'Expected Price',
      getValue: c => formatPrice(c.expectedPriceInr),
      compare: (a, b) => ({ c1Wins: a.expectedPriceInr < b.expectedPriceInr, c2Wins: b.expectedPriceInr < a.expectedPriceInr }),
    },
    { label: 'Launch Date', getValue: c => formatLaunchDate(c.expectedLaunchDate) },
    { label: 'Engine / Battery', getValue: c => c.engineOrBatterySpecs || '—' },
    {
      label: 'Top Speed',
      getValue: c => `${c.topSpeed.toString()} km/h`,
      compare: (a, b) => ({ c1Wins: a.topSpeed > b.topSpeed, c2Wins: b.topSpeed > a.topSpeed }),
    },
    {
      label: 'Range (EV)',
      getValue: c => isEVCar(c) ? `${c.range.toString()} km` : '—',
      compare: (a, b) => {
        if (!isEVCar(a) || !isEVCar(b)) return { c1Wins: false, c2Wins: false };
        return { c1Wins: a.range > b.range, c2Wins: b.range > a.range };
      },
    },
    {
      label: 'Mileage (Petrol)',
      getValue: c => !isEVCar(c) ? `${c.mileage.toString()} kmpl` : '—',
      compare: (a, b) => {
        if (isEVCar(a) || isEVCar(b)) return { c1Wins: false, c2Wins: false };
        return { c1Wins: a.mileage > b.mileage, c2Wins: b.mileage > a.mileage };
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="red-accent-line mb-3" />
        <h1 className="section-title mb-2 flex items-center gap-3">
          <ArrowLeftRight className="w-8 h-8 text-auto-red" />
          Compare Cars
        </h1>
        <p className="text-muted-foreground">Select two cars to compare side by side</p>
      </div>

      {/* Car Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Car 1</label>
          <CarSelector
            cars={allCars}
            selected={car1}
            onSelect={setCar1}
            placeholder="Select first car…"
            excludeId={car2?.id}
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Car 2</label>
          <CarSelector
            cars={allCars}
            selected={car2}
            onSelect={setCar2}
            placeholder="Select second car…"
            excludeId={car1?.id}
          />
        </div>
      </div>

      {carsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-auto-red" />
        </div>
      )}

      {!car1 && !car2 && !carsLoading && (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-xl">
          <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-heading text-xl uppercase mb-2">Select Two Cars</p>
          <p className="text-sm">Choose cars from the dropdowns above to start comparing</p>
        </div>
      )}

      {/* Comparison Table */}
      {c1 && c2 && (
        <div className="overflow-x-auto">
          {compLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-auto-red" />
            </div>
          )}

          {/* Car Images Header */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground self-end pb-2">Specification</div>
            <div className="text-center">
              <div className="aspect-[16/10] rounded-lg overflow-hidden bg-secondary mb-2">
                <img
                  src={getCarImageUrl(c1.images)}
                  alt={c1.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/assets/generated/car-placeholder.dim_800x500.png'; }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{c1.brand}</p>
              <p className="font-heading font-bold uppercase">{c1.name}</p>
            </div>
            <div className="text-center">
              <div className="aspect-[16/10] rounded-lg overflow-hidden bg-secondary mb-2">
                <img
                  src={getCarImageUrl(c2.images)}
                  alt={c2.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/assets/generated/car-placeholder.dim_800x500.png'; }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{c2.brand}</p>
              <p className="font-heading font-bold uppercase">{c2.name}</p>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {rows.map((row, i) => {
              const result = row.compare ? row.compare(c1, c2) : { c1Wins: false, c2Wins: false };
              return (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 gap-4 px-4 py-3 ${i % 2 === 0 ? 'bg-secondary/30' : ''} border-b border-border last:border-0`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground self-center">{row.label}</div>
                  <div className={`text-sm font-semibold text-center self-center ${result.c1Wins ? 'text-green-400' : ''}`}>
                    {row.getValue(c1)}
                    <WinBadge wins={result.c1Wins} />
                  </div>
                  <div className={`text-sm font-semibold text-center self-center ${result.c2Wins ? 'text-green-400' : ''}`}>
                    {row.getValue(c2)}
                    <WinBadge wins={result.c2Wins} />
                  </div>
                </div>
              );
            })}

            {/* Safety Features */}
            <div className={`grid grid-cols-3 gap-4 px-4 py-3 bg-secondary/30 border-b border-border`}>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Safety Features</div>
              <div className="text-sm text-center">
                {c1.safetyFeatures.length > 0 ? (
                  <ul className="text-left space-y-0.5">
                    {c1.safetyFeatures.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                    {c1.safetyFeatures.length > 3 && <li className="text-xs text-muted-foreground">+{c1.safetyFeatures.length - 3} more</li>}
                  </ul>
                ) : '—'}
              </div>
              <div className="text-sm text-center">
                {c2.safetyFeatures.length > 0 ? (
                  <ul className="text-left space-y-0.5">
                    {c2.safetyFeatures.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                    {c2.safetyFeatures.length > 3 && <li className="text-xs text-muted-foreground">+{c2.safetyFeatures.length - 3} more</li>}
                  </ul>
                ) : '—'}
              </div>
            </div>

            {/* Pros */}
            <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-border">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pros</div>
              <div>
                {c1.pros.length > 0 ? (
                  <ul className="space-y-0.5">
                    {c1.pros.slice(0, 3).map((p, i) => (
                      <li key={i} className="flex items-start gap-1 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />{p}
                      </li>
                    ))}
                  </ul>
                ) : '—'}
              </div>
              <div>
                {c2.pros.length > 0 ? (
                  <ul className="space-y-0.5">
                    {c2.pros.slice(0, 3).map((p, i) => (
                      <li key={i} className="flex items-start gap-1 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />{p}
                      </li>
                    ))}
                  </ul>
                ) : '—'}
              </div>
            </div>

            {/* Cons */}
            <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-secondary/30">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cons</div>
              <div>
                {c1.cons.length > 0 ? (
                  <ul className="space-y-0.5">
                    {c1.cons.slice(0, 3).map((c, i) => (
                      <li key={i} className="flex items-start gap-1 text-xs text-destructive">
                        <XCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />{c}
                      </li>
                    ))}
                  </ul>
                ) : '—'}
              </div>
              <div>
                {c2.cons.length > 0 ? (
                  <ul className="space-y-0.5">
                    {c2.cons.slice(0, 3).map((c, i) => (
                      <li key={i} className="flex items-start gap-1 text-xs text-destructive">
                        <XCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />{c}
                      </li>
                    ))}
                  </ul>
                ) : '—'}
              </div>
            </div>
          </div>

          {/* View Detail Links */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Link to="/cars/$carId" params={{ carId: c1.id.toString() }} className="btn-auto-primary text-center text-sm">
              View {c1.name} Details
            </Link>
            <Link to="/cars/$carId" params={{ carId: c2.id.toString() }} className="btn-auto-primary text-center text-sm">
              View {c2.name} Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
