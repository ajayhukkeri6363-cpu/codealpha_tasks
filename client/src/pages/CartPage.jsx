import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

export const CartPage = () => {
  const {
    items,
    totalItems,
    subtotal,
    discountAmount,
    discountPercent,
    couponCode,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleCheckoutRedirect = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our latest items!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all"
        >
          <span>Discover Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart ({totalItems})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your selected items before checkout</p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-2 rounded-xl hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-1.5 text-indigo-900">
            <Truck className="w-4 h-4 text-indigo-600" />
            {amountNeededForFreeShipping > 0 ? (
              <span>
                Add <strong className="text-indigo-600">{formatCurrency(amountNeededForFreeShipping)}</strong> more to get <strong>FREE Shipping!</strong>
              </span>
            ) : (
              <span className="text-emerald-700 font-bold">
                🎉 Congratulations! You have unlocked FREE Express Delivery!
              </span>
            )}
          </div>
          <span className="text-indigo-600">{Math.round(progressToFreeShipping)}%</span>
        </div>
        <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const product = item.product || {};
            const productId = product._id || item.product;
            const maxStock = product.countInStock || 99;

            return (
              <div
                key={productId}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-5 group"
              >
                {/* Thumbnail */}
                <Link
                  to={`/products/${productId}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 overflow-hidden shrink-0 block"
                >
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left w-full sm:w-auto">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {product.category || 'Product'}
                  </span>
                  <Link
                    to={`/products/${productId}`}
                    className="font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition-colors line-clamp-1 block"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-400">Unit Price: {formatCurrency(product.price)}</p>

                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 font-bold text-xs hover:bg-slate-100 disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 font-bold text-xs hover:bg-slate-100 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(productId)}
                      className="text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="text-right sm:pl-4 sm:border-l sm:border-slate-100 shrink-0">
                  <span className="text-base sm:text-lg font-extrabold text-slate-900 block">
                    {formatCurrency(product.price * item.quantity)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.quantity} × {formatCurrency(product.price)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Input */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" /> Have a Coupon?
            </h4>
            {couponCode ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-800">
                  Code "{couponCode}" applied ({discountPercent}% OFF)
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Try 'SAVE10'"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-indigo-500 font-medium uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Breakdown Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Order Summary
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-600 uppercase font-bold">Free</span>
                  ) : (
                    formatCurrency(shippingPrice)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(taxPrice)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Grand Total</span>
                <span className="text-2xl font-black text-indigo-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleCheckoutRedirect}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Taxes and shipping calculated at final checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
