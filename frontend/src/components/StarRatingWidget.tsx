import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingWidgetProps {
  averageRating?: number;
  totalRatings?: number;
  onSubmit?: (rating: number) => Promise<void>;
}

export function StarRatingWidget({ averageRating = 0, totalRatings = 0, onSubmit }: StarRatingWidgetProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selected || !onSubmit) return;
    setLoading(true);
    setError('');
    try {
      await onSubmit(selected);
      setSubmitted(true);
    } catch {
      setError('Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hovered || selected || averageRating;

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-heading text-lg font-bold uppercase tracking-wide mb-4">User Rating</h3>

      {/* Average */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
            />
          ))}
        </div>
        <span className="text-lg font-bold">{averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}</span>
        <span className="text-sm text-muted-foreground">({totalRatings} ratings)</span>
      </div>

      {/* Submit */}
      {!submitted ? (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Rate this car:</p>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setSelected(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= displayRating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
          {selected > 0 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-auto-primary text-sm disabled:opacity-50"
            >
              {loading ? 'Submitting…' : 'Submit Rating'}
            </button>
          )}
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-green-500">
          <Star className="w-4 h-4 fill-green-500" />
          <span>Thanks for rating! You gave {selected} star{selected !== 1 ? 's' : ''}.</span>
        </div>
      )}
    </div>
  );
}
