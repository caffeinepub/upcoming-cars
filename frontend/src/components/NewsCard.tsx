import React from 'react';
import { Link } from '@tanstack/react-router';
import { Calendar, Tag } from 'lucide-react';
import { NewsArticle } from '../backend';
import { getArticleImageUrl, truncateText, formatLaunchDate } from '../lib/utils';

interface NewsCardProps {
  article: NewsArticle;
}

const categoryColors: Record<string, string> = {
  'EV Market Trends': 'bg-blue-900/40 text-blue-300',
  'Petrol vs EV': 'bg-orange-900/40 text-orange-300',
  'Government Policies': 'bg-green-900/40 text-green-300',
  'Launch Announcements': 'bg-purple-900/40 text-purple-300',
  'General News': 'bg-gray-700/40 text-gray-300',
};

export function NewsCard({ article }: NewsCardProps) {
  const imageUrl = getArticleImageUrl(article.image);
  const categoryClass = categoryColors[article.category] || 'bg-gray-700/40 text-gray-300';

  return (
    <Link to="/news/$articleId" params={{ articleId: article.id.toString() }} className="block group">
      <div className="auto-card card-shine h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/10] bg-secondary">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/generated/news-placeholder.dim_600x400.png';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryClass}`}>
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading text-base font-bold uppercase tracking-wide mb-2 group-hover:text-auto-red transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {truncateText(article.content, 120)}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatLaunchDate(article.publishedAt)}</span>
            </div>
            {article.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>{article.tags[0]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
