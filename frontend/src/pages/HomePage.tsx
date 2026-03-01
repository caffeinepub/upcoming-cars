import React, { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Zap, Fuel, TrendingUp, Newspaper } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { NewsSlider } from '../components/NewsSlider';
import { TrendingCarsGrid } from '../components/TrendingCarsGrid';
import { NewsletterForm } from '../components/NewsletterForm';
import { NewsCard } from '../components/NewsCard';
import { useGetAllCars, useGetAllArticles } from '../hooks/useQueries';

const BRANDS = [
  { name: 'Tata', logo: '🔵' },
  { name: 'Mahindra', logo: '🔴' },
  { name: 'Hyundai', logo: '🟡' },
  { name: 'Maruti', logo: '🟢' },
  { name: 'Kia', logo: '⚪' },
  { name: 'MG', logo: '🟠' },
  { name: 'BMW', logo: '🔷' },
  { name: 'Mercedes', logo: '⭐' },
];

export function HomePage() {
  const { data: allCars = [], isLoading: carsLoading } = useGetAllCars();
  const { data: allArticles = [], isLoading: articlesLoading } = useGetAllArticles();

  const featuredCars = useMemo(() => allCars.filter(c => c.isFeatured), [allCars]);
  const trendingCars = useMemo(() => allCars.filter(c => c.isTrending), [allCars]);
  const latestArticles = useMemo(
    () => [...allArticles].sort((a, b) => Number(b.publishedAt - a.publishedAt)).slice(0, 5),
    [allArticles]
  );
  const latestArticlesGrid = useMemo(
    () => [...allArticles].sort((a, b) => Number(b.publishedAt - a.publishedAt)).slice(0, 6),
    [allArticles]
  );

  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection featuredCars={featuredCars} isLoading={carsLoading} />

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      {/* 2. Latest News Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="red-accent-line mb-3" />
            <h2 className="section-title flex items-center gap-2">
              <Newspaper className="w-7 h-7 text-auto-red" />
              Latest News
            </h2>
          </div>
          <Link to="/news" className="text-sm font-heading font-bold uppercase tracking-wider text-auto-red hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <NewsSlider articles={latestArticles} isLoading={articlesLoading} />
      </section>

      {/* 3. Trending Cars */}
      <section className="bg-secondary/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="red-accent-line mb-3" />
              <h2 className="section-title flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-auto-red" />
                Trending Cars
              </h2>
            </div>
            <Link to="/cars" className="text-sm font-heading font-bold uppercase tracking-wider text-auto-red hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <TrendingCarsGrid cars={trendingCars} isLoading={carsLoading} />
        </div>
      </section>

      {/* 4. EV vs Petrol Comparison */}
      <section className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/assets/generated/ev-vs-petrol-bg.dim_1200x400.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="red-accent-line mx-auto mb-3" />
            <h2 className="section-title">EV vs Petrol</h2>
            <p className="text-muted-foreground mt-2">Which is right for you?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* EV */}
            <div className="bg-card border border-border rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold uppercase">Electric</h3>
                  <p className="text-xs text-muted-foreground">Zero emissions, future-ready</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                {['Zero tailpipe emissions', 'Lower running costs', 'Instant torque delivery', 'Government subsidies', 'Home charging convenience'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/cars" className="mt-5 block text-center py-2 border border-blue-500/50 text-blue-400 rounded font-heading font-bold uppercase text-sm hover:bg-blue-900/20 transition-all">
                Explore EVs
              </Link>
            </div>

            {/* Petrol */}
            <div className="bg-card border border-border rounded-xl p-6 hover:border-orange-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-900/30 flex items-center justify-center">
                  <Fuel className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold uppercase">Petrol</h3>
                  <p className="text-xs text-muted-foreground">Proven performance, wide range</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                {['Extensive refueling network', 'Longer highway range', 'Lower upfront cost', 'Established service network', 'Familiar technology'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/cars" className="mt-5 block text-center py-2 border border-orange-500/50 text-orange-400 rounded font-heading font-bold uppercase text-sm hover:bg-orange-900/20 transition-all">
                Explore Petrol Cars
              </Link>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/compare" className="btn-auto-primary inline-flex items-center gap-2">
              Compare Two Cars <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Featured Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="red-accent-line mx-auto mb-3" />
          <h2 className="section-title">Featured Brands</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {BRANDS.map((brand) => (
            <Link
              key={brand.name}
              to="/cars"
              className="flex flex-col items-center gap-2 p-3 bg-card border border-border rounded-lg hover:border-auto-red transition-all group"
            >
              <span className="text-2xl">{brand.logo}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Newsletter */}
      <section className="bg-secondary/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="red-accent-line mx-auto mb-3" />
          <h2 className="section-title mb-3">Stay Updated</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Get the latest car launch dates, prices, and automotive news delivered to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* 7. Latest Articles */}
      {latestArticlesGrid.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="red-accent-line mb-3" />
              <h2 className="section-title">Latest Articles</h2>
            </div>
            <Link to="/news" className="text-sm font-heading font-bold uppercase tracking-wider text-auto-red hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestArticlesGrid.map(article => (
              <NewsCard key={article.id.toString()} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
