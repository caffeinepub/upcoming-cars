import React, { useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { NewsArticle } from '../backend';
import { getArticleImageUrl, truncateText, formatLaunchDate } from '../lib/utils';

interface NewsSliderProps {
  articles: NewsArticle[];
  isLoading: boolean;
}

export function NewsSlider({ articles, isLoading }: NewsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-72 h-64 bg-secondary rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="font-heading text-lg uppercase">No news articles yet</p>
        <p className="text-sm mt-1">Check back soon for the latest automotive updates</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-card border border-border rounded-full flex items-center justify-center hover:bg-auto-red hover:text-white hover:border-auto-red transition-all shadow-auto"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {articles.map((article) => (
          <Link
            key={article.id.toString()}
            to="/news/$articleId"
            params={{ articleId: article.id.toString() }}
            className="flex-shrink-0 w-72 group"
          >
            <div className="auto-card card-shine h-full">
              <div className="relative overflow-hidden aspect-[16/10] bg-secondary">
                <img
                  src={getArticleImageUrl(article.image)}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/generated/news-placeholder.dim_600x400.png';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-auto-red text-white">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wide line-clamp-2 group-hover:text-auto-red transition-colors mb-1">
                  {article.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {truncateText(article.content, 80)}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatLaunchDate(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-card border border-border rounded-full flex items-center justify-center hover:bg-auto-red hover:text-white hover:border-auto-red transition-all shadow-auto"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
