import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, CheckCircle, AlertCircle, Car as CarIcon, Newspaper } from 'lucide-react';
import { CarForm } from '../components/CarForm';
import { NewsForm } from '../components/NewsForm';
import {
  useGetAllCars, useGetAllArticles,
  useAdminAddCar, useAdminUpdateCar, useAdminDeleteCar,
  useAdminAddNews, useAdminUpdateNews, useAdminDeleteNews,
} from '../hooks/useQueries';
import { Car, NewsArticle, ExternalBlob } from '../backend';
import { formatPrice, formatLaunchDate, getArticleImageUrl } from '../lib/utils';

type Tab = 'cars' | 'news';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('cars');
  const [showCarForm, setShowCarForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: cars = [], isLoading: carsLoading } = useGetAllCars();
  const { data: articles = [], isLoading: articlesLoading } = useGetAllArticles();

  const addCar = useAdminAddCar();
  const updateCar = useAdminUpdateCar();
  const deleteCar = useAdminDeleteCar();
  const addNews = useAdminAddNews();
  const updateNews = useAdminUpdateNews();
  const deleteNews = useAdminDeleteNews();

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddCar = async (data: Parameters<typeof addCar.mutateAsync>[0]) => {
    try {
      await addCar.mutateAsync(data);
      setShowCarForm(false);
      showFeedback('success', 'Car added successfully!');
    } catch {
      showFeedback('error', 'Failed to add car. Please try again.');
    }
  };

  const handleUpdateCar = async (data: Parameters<typeof addCar.mutateAsync>[0]) => {
    if (!editingCar) return;
    try {
      await updateCar.mutateAsync({ ...editingCar, ...data });
      setEditingCar(null);
      showFeedback('success', 'Car updated successfully!');
    } catch {
      showFeedback('error', 'Failed to update car.');
    }
  };

  const handleDeleteCar = async (carId: bigint) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      await deleteCar.mutateAsync(carId);
      showFeedback('success', 'Car deleted.');
    } catch {
      showFeedback('error', 'Failed to delete car.');
    }
  };

  const handleAddNews = async (data: { title: string; category: string; content: string; image: ExternalBlob | null; tags: string[] }) => {
    try {
      const image = data.image ?? ExternalBlob.fromURL('/assets/generated/news-placeholder.dim_600x400.png');
      await addNews.mutateAsync({ ...data, image });
      setShowNewsForm(false);
      showFeedback('success', 'Article added successfully!');
    } catch {
      showFeedback('error', 'Failed to add article.');
    }
  };

  const handleUpdateNews = async (data: { title: string; category: string; content: string; image: ExternalBlob | null; tags: string[] }) => {
    if (!editingArticle) return;
    try {
      const image = data.image ?? editingArticle.image;
      await updateNews.mutateAsync({ ...editingArticle, ...data, image });
      setEditingArticle(null);
      showFeedback('success', 'Article updated successfully!');
    } catch {
      showFeedback('error', 'Failed to update article.');
    }
  };

  const handleDeleteNews = async (articleId: bigint) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteNews.mutateAsync(articleId);
      showFeedback('success', 'Article deleted.');
    } catch {
      showFeedback('error', 'Failed to delete article.');
    }
  };

  function isEVCar(car: Car): boolean {
    if (typeof car.carType === 'string') return car.carType === 'ev';
    return (car.carType as unknown as { ev?: unknown })?.ev !== undefined;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="red-accent-line mb-3" />
        <h1 className="section-title mb-1">Admin Panel</h1>
        <p className="text-muted-foreground text-sm">Manage cars and news articles</p>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${
          feedback.type === 'success' ? 'bg-green-900/20 border border-green-700/30' : 'bg-destructive/10 border border-destructive/30'
        }`}>
          {feedback.type === 'success'
            ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            : <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          }
          <p className={`text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-destructive'}`}>
            {feedback.message}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-8 w-fit">
        <button
          onClick={() => setActiveTab('cars')}
          className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${
            activeTab === 'cars' ? 'bg-auto-red text-white' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CarIcon className="w-4 h-4" /> Cars
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${
            activeTab === 'news' ? 'bg-auto-red text-white' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Newspaper className="w-4 h-4" /> News
        </button>
      </div>

      {/* Cars Tab */}
      {activeTab === 'cars' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
              Cars <span className="text-muted-foreground text-base font-normal">({cars.length})</span>
            </h2>
            {!showCarForm && !editingCar && (
              <button
                onClick={() => setShowCarForm(true)}
                className="btn-auto-primary flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> Add Car
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {(showCarForm || editingCar) && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide mb-5">
                {editingCar ? `Edit: ${editingCar.name}` : 'Add New Car'}
              </h3>
              <CarForm
                initialData={editingCar ?? undefined}
                onSubmit={editingCar ? handleUpdateCar : handleAddCar}
                onCancel={() => { setShowCarForm(false); setEditingCar(null); }}
                isLoading={addCar.isPending || updateCar.isPending}
              />
            </div>
          )}

          {/* Cars List */}
          {carsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-auto-red" />
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
              <CarIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-heading text-lg uppercase">No cars yet</p>
              <p className="text-sm mt-1">Add your first car using the button above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cars.map(car => (
                <div key={car.id.toString()} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                  <div className="w-16 h-12 rounded overflow-hidden bg-secondary flex-shrink-0">
                    <img
                      src={car.images.length > 0 ? car.images[0].getDirectURL() : '/assets/generated/car-placeholder.dim_800x500.png'}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/assets/generated/car-placeholder.dim_800x500.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={isEVCar(car) ? 'type-badge-ev' : 'type-badge-petrol'}>
                        {isEVCar(car) ? 'EV' : 'Petrol'}
                      </span>
                      {car.isTrending && <span className="text-xs bg-auto-red/20 text-auto-red px-1.5 py-0.5 rounded font-bold">Trending</span>}
                      {car.isFeatured && <span className="text-xs bg-yellow-900/30 text-yellow-400 px-1.5 py-0.5 rounded font-bold">Featured</span>}
                    </div>
                    <p className="font-heading font-bold uppercase truncate">{car.brand} {car.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(car.expectedPriceInr)} · {formatLaunchDate(car.expectedLaunchDate)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditingCar(car); setShowCarForm(false); }}
                      className="w-8 h-8 flex items-center justify-center rounded border border-border hover:border-auto-red hover:text-auto-red transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      disabled={deleteCar.isPending}
                      className="w-8 h-8 flex items-center justify-center rounded border border-border hover:border-destructive hover:text-destructive transition-all disabled:opacity-50"
                    >
                      {deleteCar.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* News Tab */}
      {activeTab === 'news' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
              Articles <span className="text-muted-foreground text-base font-normal">({articles.length})</span>
            </h2>
            {!showNewsForm && !editingArticle && (
              <button
                onClick={() => setShowNewsForm(true)}
                className="btn-auto-primary flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> Add Article
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {(showNewsForm || editingArticle) && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide mb-5">
                {editingArticle ? `Edit: ${editingArticle.title}` : 'Add New Article'}
              </h3>
              <NewsForm
                initialData={editingArticle ?? undefined}
                onSubmit={editingArticle ? handleUpdateNews : handleAddNews}
                onCancel={() => { setShowNewsForm(false); setEditingArticle(null); }}
                isLoading={addNews.isPending || updateNews.isPending}
              />
            </div>
          )}

          {/* Articles List */}
          {articlesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-auto-red" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
              <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-heading text-lg uppercase">No articles yet</p>
              <p className="text-sm mt-1">Add your first article using the button above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...articles].sort((a, b) => Number(b.publishedAt - a.publishedAt)).map(article => (
                <div key={article.id.toString()} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                  <div className="w-16 h-12 rounded overflow-hidden bg-secondary flex-shrink-0">
                    <img
                      src={getArticleImageUrl(article.image)}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/assets/generated/news-placeholder.dim_600x400.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
                        {article.category}
                      </span>
                    </div>
                    <p className="font-heading font-bold uppercase truncate">{article.title}</p>
                    <p className="text-xs text-muted-foreground">{formatLaunchDate(article.publishedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditingArticle(article); setShowNewsForm(false); }}
                      className="w-8 h-8 flex items-center justify-center rounded border border-border hover:border-auto-red hover:text-auto-red transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNews(article.id)}
                      disabled={deleteNews.isPending}
                      className="w-8 h-8 flex items-center justify-center rounded border border-border hover:border-destructive hover:text-destructive transition-all disabled:opacity-50"
                    >
                      {deleteNews.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
