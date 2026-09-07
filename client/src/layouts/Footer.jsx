import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Heart,
  Mail,
  ArrowRight,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      {/* Value Propositions / Trust Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Free Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">On all orders exceeding $50</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400 mt-0.5">Encrypted JWT & verified payment</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free money-back guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">24/7 Expert Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated customer service team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                ShopSphere
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              ShopSphere is an industry-grade full-stack e-commerce experience offering curated modern electronics, apparel, footwear, accessories, and home goods.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Subscribe to our Newsletter
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Clothing" className="hover:text-white transition-colors">
                  Clothing & Apparel
                </Link>
              </li>
              <li>
                <Link to="/products?category=Shoes" className="hover:text-white transition-colors">
                  Shoes & Footwear
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-white transition-colors">
                  Bags & Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home%20%26%20Kitchen" className="hover:text-white transition-colors">
                  Home & Kitchen
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/products?isFeatured=true" className="hover:text-white transition-colors">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link to="/products?isBestSeller=true" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Internship Project Details */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Internship Info
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built for <strong>CodeAlpha Full Stack Development Internship</strong> (Task 1: Simple E-commerce Store).
            </p>
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-slate-300 font-medium">Stack: React, Vite, Node, Express, MongoDB</span>
              <span className="text-slate-400">REST API & JWT Architecture</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved. CodeAlpha Internship.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered with passion for high performance</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
