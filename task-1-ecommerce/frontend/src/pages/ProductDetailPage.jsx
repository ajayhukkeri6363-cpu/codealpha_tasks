import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  MessageSquarePlus,
  Star,
  Trash2,
  Lock,
} from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RatingStars } from '../components/RatingStars';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], total: 0, distribution: {} });
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const prodData = await productService.getProductById(id);
        setProduct(prodData);
        if (prodData.images?.length > 0) {
          setSelectedImage(prodData.images[0]);
        }

        // Fetch reviews
        const revData = await reviewService.getProductReviews(id);
        setReviewsData(revData);
      } catch (err) {
        console.error('Failed to load product details:', err);
        toast.error('Product could not be loaded');
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-[4/3] bg-slate-200 rounded-3xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="h-10 bg-slate-200 rounded w-1/2" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <Link to="/products" className="text-indigo-600 font-semibold mt-4 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.countInStock <= 0;
  const maxAvailable = product.countInStock || 0;
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setAddingToCart(true);
    await addToCart(product, quantity);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    const success = await addToCart(product, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        productId: product._id,
        rating,
        comment: comment.trim(),
      });
      toast.success('Your review was posted successfully!');
      setComment('');
      // Reload reviews
      const updatedRev = await reviewService.getProductReviews(product._id);
      setReviewsData(updatedRev);
      // Reload product rating
      const updatedProd = await productService.getProductById(product._id);
      setProduct(updatedProd);
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      toast.success('Review deleted');
      const updatedRev = await reviewService.getProductReviews(product._id);
      setReviewsData(updatedRev);
      const updatedProd = await productService.getProductById(product._id);
      setProduct(updatedProd);
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-slate-600 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-600 transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/3] rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm flex items-center justify-center">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnail Selector */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Brand: <strong className="text-slate-700">{product.brand}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 pt-1">
              <RatingStars rating={product.rating} numReviews={product.numReviews} size="md" />
              <a href="#reviews-section" className="text-xs font-semibold text-indigo-600 hover:underline">
                Read all reviews
              </a>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-4 rounded-2xl bg-slate-100/70 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-xs font-medium text-slate-500 ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          {/* Stock Status Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Availability:</span>
            {isOutOfStock ? (
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200">
                Out of Stock
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                In Stock ({product.countInStock} available)
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 font-bold text-sm hover:bg-slate-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxAvailable, q + 1))}
                    disabled={quantity >= maxAvailable}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 font-bold text-sm hover:bg-slate-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  (Max {maxAvailable} units)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          )}

          {/* Guarantees Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Fast Worldwide Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>100% Genuine Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && product.specifications.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Product Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {product.specifications.map((spec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm"
              >
                <span className="font-semibold text-slate-500">{spec.key}</span>
                <span className="font-bold text-slate-900 text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section id="reviews-section" className="space-y-8 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Reviews ({reviewsData.total})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Real feedback from verified purchasers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rating Breakdown & Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-2">
              <span className="text-5xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
              <div className="flex justify-center">
                <RatingStars rating={product.rating} showText={false} size="md" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Based on {reviewsData.total} {reviewsData.total === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Submit Review Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-indigo-600" /> Write a Review
              </h4>

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Your Rating
                    </label>
                    <RatingStars rating={rating} size="lg" interactive onRate={setRating} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Your Experience
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share detailed feedback about durability, quality, shipping..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-xs outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                  <p className="text-xs text-slate-600">Please sign in to rate and review this product.</p>
                  <Link
                    to="/login"
                    className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Sign In to Review
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviewsData.reviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
                <p className="text-sm font-semibold text-slate-700">No reviews yet for this product.</p>
                <p className="text-xs text-slate-400 mt-1">Be the first to share your thoughts!</p>
              </div>
            ) : (
              reviewsData.reviews.map((rev) => {
                const isOwner = user && (user._id === rev.user || user.role === 'admin');

                return (
                  <div
                    key={rev._id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.userName}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/10"
                        />
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">{rev.userName}</h5>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {formatDate(rev.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <RatingStars rating={rev.rating} size="xs" showText={false} />
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                      {rev.comment}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
