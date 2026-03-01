import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInr: bigint): string {
  const price = Number(priceInr);
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatLaunchDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return 'TBA';
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatLaunchYear(timestamp: bigint): number {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return new Date().getFullYear();
  return date.getFullYear();
}

export function getCarImageUrl(images: import('../backend').ExternalBlob[]): string {
  if (images && images.length > 0) {
    return images[0].getDirectURL();
  }
  return '/assets/generated/car-placeholder.dim_800x500.png';
}

export function getArticleImageUrl(image: import('../backend').ExternalBlob | null | undefined): string {
  if (image) {
    return image.getDirectURL();
  }
  return '/assets/generated/news-placeholder.dim_600x400.png';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
