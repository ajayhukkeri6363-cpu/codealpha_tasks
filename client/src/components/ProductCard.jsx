import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RatingStars } from './RatingStars';
import { formatCurrency } from '../utils/formatters';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const success = await addToCart(product, 1);
    setAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {discountPercent > 0 && (
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg bg-rose-500 text-white shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg bg-amber-500 text-white shadow-sm">
            Best Seller
          </span>
        )}
        {product.isFeatured && !product.isBestSeller && (
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg bg-indigo-600 text-white shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden block"
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            {product.brand}
          </span>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2 hover:text-indigo-600 transition-colors mb-2 leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating} numReviews={product.numReviews} size="xs" />
        </div>

        {/* Stock status indicator */}
        <div className="mb-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Only {product.countInStock} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock || adding}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-sm hover:shadow-md hover:shadow-indigo-500/20'
            }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-white shrink-0" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : adding ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
