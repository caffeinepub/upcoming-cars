import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { Car } from '../backend';

interface CarSelectorProps {
  cars: Car[];
  selected: Car | null;
  onSelect: (car: Car | null) => void;
  placeholder?: string;
  excludeId?: bigint;
}

function isEVCar(car: Car): boolean {
  if (typeof car.carType === 'string') return car.carType === 'ev';
  return (car.carType as unknown as { ev?: unknown })?.ev !== undefined;
}

export function CarSelector({ cars, selected, onSelect, placeholder = 'Select a car', excludeId }: CarSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = cars
    .filter(c => excludeId === undefined || c.id !== excludeId)
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.toLowerCase().includes(search.toLowerCase())
    );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm hover:border-auto-red transition-colors"
      >
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected ? `${selected.brand} ${selected.name}` : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selected && (
            <span
              onClick={(e) => { e.stopPropagation(); onSelect(null); }}
              className="p-0.5 hover:text-auto-red transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-auto z-50 overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cars…"
                className="w-full pl-8 pr-3 py-1.5 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No cars found</p>
            ) : (
              filtered.map(car => (
                <button
                  key={car.id.toString()}
                  type="button"
                  onClick={() => { onSelect(car); setOpen(false); setSearch(''); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors flex items-center justify-between"
                >
                  <span>
                    <span className="font-semibold">{car.brand}</span> {car.name}
                  </span>
                  <span className={isEVCar(car) ? 'type-badge-ev' : 'type-badge-petrol'}>
                    {isEVCar(car) ? 'EV' : 'Petrol'}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
