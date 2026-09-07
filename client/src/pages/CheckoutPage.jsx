import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatters';

export const CheckoutPage = () => {
  const {
    items,
    subtotal,
    discountAmount,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');
  const [country, setCountry] = useState(user?.address?.country || 'United States');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!fullName || !phone || !address || !city || !state || !pincode) {
      toast.error('Please fill in all shipping details');
      return;
    }

    setPlacingOrder(true);
    try {
      // Save address to profile if checked
      if (saveAddressToProfile) {
        try {
          await updateProfile({
            phone,
            address: { street: address, city, state, pincode, country },
          });
        } catch (e) {
          console.warn('Could not auto-save address to profile:', e);
        }
      }

      const orderItems = items.map((item) => {
        const prod = item.product || {};
        return {
          product: prod._id || item.product,
          name: prod.name || 'Product',
          quantity: item.quantity,
          price: prod.price || 0,
          image: prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
        };
      });

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          state,
          pincode,
          country,
        },
        paymentMethod,
        itemsPrice: subtotal - discountAmount,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const createdOrder = await orderService.createOrder(orderData);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${createdOrder._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/cart"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-xs text-slate-500 mt-0.5">Complete your shipping and payment information</p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Shipping & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Shipping Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm outline-none font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  State / Province *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Postal / Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm outline-none font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAddressToProfile}
                  onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Save this address as default in my account profile</span>
              </label>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Select Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash on Delivery */}
              <label
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-6 h-6 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Pay securely with cash upon doorstep package delivery.
                </p>
              </label>

              {/* Demo Card / Online Payment */}
              <label
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'Demo Card / Online'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-sm">Demo Online Payment</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="Demo Card / Online"
                    checked={paymentMethod === 'Demo Card / Online'}
                    onChange={() => setPaymentMethod('Demo Card / Online')}
                    className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Instant simulated credit card & UPI authorization flow.
                </p>
              </label>
            </div>

            {paymentMethod === 'Demo Card / Online' && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-800 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Demo sandbox mode active. No actual credit card charge will be made.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <h4 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h4>

            {/* Items mini list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const prod = item.product || {};
                return (
                  <div key={prod._id || item.product} className="flex items-center gap-3">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{prod.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {formatCurrency(prod.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingPrice === 0 ? 'FREE' : formatCurrency(shippingPrice)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Tax (8%)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(taxPrice)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Due</span>
                <span className="text-2xl font-black text-indigo-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {placingOrder ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Place Order Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
