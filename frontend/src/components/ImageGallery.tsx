import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ExternalBlob } from '../backend';

interface ImageGalleryProps {
  images: ExternalBlob[];
  altPrefix?: string;
}

export function ImageGallery({ images, altPrefix = 'Car' }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const imageUrls = images.length > 0
    ? images.map(img => img.getDirectURL())
    : ['/assets/generated/car-placeholder.dim_800x500.png'];

  const handlePrev = () => setActiveIndex(i => (i - 1 + imageUrls.length) % imageUrls.length);
  const handleNext = () => setActiveIndex(i => (i + 1) % imageUrls.length);

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[16/9] bg-secondary rounded-lg overflow-hidden">
        <img
          src={imageUrls[activeIndex]}
          alt={`${altPrefix} ${activeIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/generated/car-placeholder.dim_800x500.png';
          }}
        />
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-auto-red hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-auto-red hover:text-white transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imageUrls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-auto-red w-4' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-all ${
                i === activeIndex ? 'border-auto-red' : 'border-border hover:border-muted-foreground'
              }`}
            >
              <img
                src={url}
                alt={`${altPrefix} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/generated/car-placeholder.dim_800x500.png';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
