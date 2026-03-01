import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Calendar, Tag, ArrowLeft, Loader2 } from 'lucide-react';
import { SocialShareButtons } from '../components/SocialShareButtons';
import { useGetArticle } from '../hooks/useQueries';
import { getArticleImageUrl, formatLaunchDate } from '../lib/utils';

const categoryColors: Record<string, string> = {
  'EV Market Trends': 'bg-blue-900/40 text-blue-300',
  'Petrol vs EV': 'bg-orange-900/40 text-orange-300',
  'Government Policies': 'bg-green-900/40 text-green-300',
  'Launch Announcements': 'bg-purple-900/40 text-purple-300',
  'General News': 'bg-gray-700/40 text-gray-300',
};

export function NewsDetailPage() {
  const { articleId } = useParams({ from: '/news/$articleId' });
  const articleIdBigInt = articleId ? BigInt(articleId) : null;
  const { data: article, isLoading, error } = useGetArticle(articleIdBigInt);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-auto-red" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-heading text-xl uppercase">Article not found</p>
        <Link to="/news" className="btn-auto-primary">Browse News</Link>
      </div>
    );
  }

  const imageUrl = getArticleImageUrl(article.image);
  const categoryClass = categoryColors[article.category] || 'bg-gray-700/40 text-gray-300';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link to="/news" className="hover:text-foreground transition-colors">News</Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{article.title}</span>
      </div>

      {/* Back */}
      <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to News
      </Link>

      {/* Article Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryClass}`}>
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatLaunchDate(article.publishedAt)}</span>
          </div>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight mb-4">
          {article.title}
        </h1>
        {article.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
            {article.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-secondary mb-8">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/generated/news-placeholder.dim_600x400.png';
          }}
        />
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none dark:prose-invert mb-8">
        {article.content.split('\n').map((paragraph, i) => (
          paragraph.trim() ? (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>
          ) : <br key={i} />
        ))}
      </div>

      {/* Share */}
      <div className="border-t border-border pt-6">
        <SocialShareButtons url={shareUrl} title={article.title} />
      </div>
    </div>
  );
}
