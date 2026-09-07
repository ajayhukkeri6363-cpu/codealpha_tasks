import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 0,
  numReviews,
  size = 'sm',
  showText = true,
  interactive = false,
  onRate,
}) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const starSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const filled = star <= rating;
          const half = !filled && star - 0.5 <= rating;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRate && onRate(star)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform p-0.5' : 'cursor-default'
              }`}
            >
              <Star
                className={`${starSize} ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : half
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-slate-100 text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showText && (
        <span className="text-xs font-semibold text-slate-700 ml-0.5">
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {numReviews !== undefined && (
            <span className="text-slate-400 font-normal ml-1">({numReviews})</span>
          )}
        </span>
      )}
    </div>
  );
};
