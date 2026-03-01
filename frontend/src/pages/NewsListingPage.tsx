import React, { useState, useMemo } from 'react';
import { NewsCard } from '../components/NewsCard';
import { useGetAllArticles } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES = ['All', 'EV Market Trends', 'Petrol vs EV', 'Government Policies', 'Launch Announcements', 'General News'];

export function NewsListingPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: allArticles = [], isLoading } = useGetAllArticles();

  const sorted = useMemo(
    () => [...allArticles].sort((a, b) => Number(b.publishedAt - a.publishedAt)),
    [allArticles]
  );

  const filtered = useMemo(
    () => activeCategory === 'All' ? sorted : sorted.filter(a => a.category === activeCategory),
    [sorted, activeCategory]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="red-accent-line mb-3" />
        <h1 className="section-title mb-2">Automotive News</h1>
        <p className="text-muted-foreground">Latest updates from the automotive world</p>
      </div>

      {/* Ad Banner */}
      <div className="mb-8">
        <div className="hidden md:block">
          <img
            src="/assets/generated/ad-banner-desktop.dim_728x90.png"
            alt="Advertisement"
            className="mx-auto rounded opacity-80"
            style={{ maxWidth: '728px', height: '90px', objectFit: 'cover' }}
          />
        </div>
        <div className="md:hidden">
          <img
            src="/assets/generated/ad-banner-mobile.dim_320x50.png"
            alt="Advertisement"
            className="mx-auto rounded opacity-80"
            style={{ maxWidth: '320px', height: '50px', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeCategory === cat
                ? 'bg-auto-red text-white'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-5">
        {isLoading ? 'Loading…' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[16/10] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-heading text-xl uppercase mb-2">No articles found</p>
          <p className="text-sm">No articles in this category yet</p>
          <button onClick={() => setActiveCategory('All')} className="mt-4 btn-auto-primary text-sm">
            View All Articles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(article => (
            <NewsCard key={article.id.toString()} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
