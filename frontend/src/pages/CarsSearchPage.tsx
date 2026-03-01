import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { CarCard } from '../components/CarCard';
import { CarFilters } from '../components/CarFilters';
import { useGetAllCars, useSearchCars, useGetCarsByFilter } from '../hooks/useQueries';
import { CarType } from '../backend';
import { formatLaunchYear } from '../lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface FilterState {
  carType: CarType | null;
  minPrice: number;
  maxPrice: number;
  brand: string | null;
  launchYear: number | null;
}

const DEFAULT_FILTERS: FilterState = {
  carType: null,
  minPrice: 0,
  maxPrice: 10000000,
  brand: null,
  launchYear: null,
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function CarsSearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 400);

  const hasActiveFilters = filters.carType !== null || filters.minPrice > 0 || filters.maxPrice < 10000000 || filters.brand !== null || filters.launchYear !== null;
  const isSearching = debouncedSearch.trim().length > 0;

  const { data: allCars = [], isLoading: allLoading } = useGetAllCars();
  const { data: searchResults = [], isLoading: searchLoading } = useSearchCars(debouncedSearch);
  const { data: filteredResults = [], isLoading: filterLoading } = useGetCarsByFilter(
    filters.carType,
    filters.minPrice > 0 ? BigInt(filters.minPrice) : null,
    filters.maxPrice < 10000000 ? BigInt(filters.maxPrice) : null,
    filters.brand,
    filters.launchYear ? BigInt(filters.launchYear) : null
  );

  const displayCars = useMemo(() => {
    if (isSearching) return searchResults;
    if (hasActiveFilters) return filteredResults;
    return allCars;
  }, [isSearching, hasActiveFilters, searchResults, filteredResults, allCars]);

  const isLoading = isSearching ? searchLoading : hasActiveFilters ? filterLoading : allLoading;

  const brands = useMemo(() => [...new Set(allCars.map(c => c.brand))].sort(), [allCars]);
  const years = useMemo(() => {
    const ys = [...new Set(allCars.map(c => formatLaunchYear(c.expectedLaunchDate)))].sort();
    return ys;
  }, [allCars]);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="red-accent-line mb-3" />
        <h1 className="section-title mb-2">Browse Cars</h1>
        <p className="text-muted-foreground">Find your perfect upcoming car</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by car name or brand…"
            className="w-full pl-10 pr-10 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-auto-red transition-colors"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold transition-all md:hidden ${
            showFilters || hasActiveFilters ? 'border-auto-red text-auto-red' : 'border-border text-muted-foreground'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-auto-red" />}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <CarFilters
            filters={filters}
            brands={brands}
            years={years}
            onChange={setFilters}
            onClear={handleClearFilters}
          />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading…' : `${displayCars.length} car${displayCars.length !== 1 ? 's' : ''} found`}
            </p>
            {(hasActiveFilters || searchInput) && (
              <button onClick={handleClearFilters} className="text-xs text-auto-red hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : displayCars.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-heading text-xl uppercase mb-2">No cars found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
              <button onClick={handleClearFilters} className="mt-4 btn-auto-primary text-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayCars.map(car => (
                <CarCard key={car.id.toString()} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
