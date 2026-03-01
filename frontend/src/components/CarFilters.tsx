import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { CarType } from '../backend';
import { formatPrice } from '../lib/utils';

interface FilterState {
  carType: CarType | null;
  minPrice: number;
  maxPrice: number;
  brand: string | null;
  launchYear: number | null;
}

interface CarFiltersProps {
  filters: FilterState;
  brands: string[];
  years: number[];
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

const MAX_PRICE = 10000000; // 1 Cr

export function CarFilters({ filters, brands, years, onChange, onClear }: CarFiltersProps) {
  const hasActiveFilters = filters.carType !== null || filters.minPrice > 0 || filters.maxPrice < MAX_PRICE || filters.brand !== null || filters.launchYear !== null;

  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-bold uppercase tracking-wide flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-auto-red" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs text-auto-red hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Type</label>
        <div className="flex gap-2">
          {(['all', 'ev', 'petrol'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onChange({ ...filters, carType: type === 'all' ? null : type as CarType })}
              className={`flex-1 py-1.5 text-xs font-bold uppercase rounded border transition-all ${
                (type === 'all' && filters.carType === null) || filters.carType === type
                  ? 'bg-auto-red text-white border-auto-red'
                  : 'border-border text-muted-foreground hover:border-auto-red'
              }`}
            >
              {type === 'all' ? 'All' : type === 'ev' ? '⚡ EV' : '⛽ Petrol'}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
          Price Range
        </label>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(BigInt(filters.minPrice))}</span>
            <span>{formatPrice(BigInt(filters.maxPrice))}</span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={100000}
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-auto-red"
          />
        </div>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Brand</label>
          <select
            value={filters.brand || ''}
            onChange={(e) => onChange({ ...filters, brand: e.target.value || null })}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      )}

      {/* Launch Year */}
      {years.length > 0 && (
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Launch Year</label>
          <select
            value={filters.launchYear || ''}
            onChange={(e) => onChange({ ...filters, launchYear: e.target.value ? Number(e.target.value) : null })}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
          >
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
