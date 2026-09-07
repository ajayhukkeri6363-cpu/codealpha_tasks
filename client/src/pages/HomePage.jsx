import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Truck,
  Star,
  Zap,
  ShoppingBag,
  Layers,
} from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featuredRes, categoriesRes] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getCategories(),
        ]);
        setFeaturedProducts(featuredRes.featured || []);
        setBestSellers(featuredRes.bestSellers || []);
        setCategories(categoriesRes || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const categoryIcons = {
    Electronics: '⚡',
    Clothing: '👕',
    Shoes: '👟',
    Accessories: '🎒',
    'Home & Kitchen': '☕',
    'Beauty & Health': '✨',
    'Sports & Outdoors': '🏆',
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next-Gen Full Stack E-Commerce Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Elevate Your Everyday <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                With Curated Luxury.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover cutting-edge electronics, premium apparel, handcrafted footwear, and artisanal home essentials with instant shipping and encrypted checkout.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?isFeatured=true"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm font-bold border border-white/20 backdrop-blur-md transition-all text-center"
              >
                Featured Releases
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-extrabold text-white">25+</p>
                <p className="text-xs text-slate-400 font-medium">Curated Items</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">4.9★</p>
                <p className="text-xs text-slate-400 font-medium">Customer Rating</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400 font-medium">Secure Checkout</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/5] bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="Sony Headphones"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold w-max uppercase tracking-wider mb-2">
                    Spotlight Item
                  </span>
                  <h3 className="text-lg font-bold text-white">Sony WH-1000XM5 ANC</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-amber-400 text-sm font-bold">★ 4.8 (18 reviews)</span>
                    <span className="text-xl font-extrabold text-white">$349.99</span>
                  </div>
                </div>
              </div>

              {/* Floating Pill 1 */}
              <div className="absolute -top-4 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-3 text-slate-900 animate-fade-in hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">Fast Fulfillment</p>
                  <p className="text-[10px] text-slate-500 font-medium">Same-day dispatch</p>
                </div>
              </div>

              {/* Floating Pill 2 */}
              <div className="absolute -bottom-5 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-3 text-slate-900 animate-fade-in hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">Verified Authentic</p>
                  <p className="text-[10px] text-slate-500 font-medium">100% genuine products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" /> Browse Collections
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-300 p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col items-center text-center overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-2xl transition-all duration-300 mb-3 shadow-inner">
                {categoryIcons[cat.name] || '📦'}
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" /> Hand-Picked Selections
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products?isFeatured=true"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            See More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-500/20">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              Limited Time Internship Special
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Enjoy 10% Off Your Entire Cart with Code <span className="text-amber-300 underline underline-offset-8">SAVE10</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Explore our best-rated electronics, stylish outerwear, and premium home appliances. Test full checkout flows, reviews, order tracking, and admin capabilities!
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-indigo-600" /> Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4 text-rose-500" /> Customer Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Best-Selling Items
            </h2>
          </div>
          <Link
            to="/products?isBestSeller=true"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
