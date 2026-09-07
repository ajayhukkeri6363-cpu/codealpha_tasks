import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  ArrowRight,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { OrderTracker } from '../components/OrderTracker';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrderById(id)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto" />
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Order Information Not Found</h2>
        <Link to="/" className="text-indigo-600 font-bold">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We've received your order and are currently preparing it for dispatch. A confirmation notification has been sent.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 text-xs font-bold text-slate-700">
          <span>Order Reference:</span>
          <code className="text-indigo-600 font-mono text-sm">{order._id}</code>
        </div>
      </div>

      {/* Visual Tracking Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-600" /> Real-Time Order Tracking
        </h3>
        <OrderTracker status={order.orderStatus} statusHistory={order.statusHistory} />
      </div>

      {/* Order Details & Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping & Payment summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-indigo-600" /> Delivery Address
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 text-xs text-slate-700 space-y-1 font-medium">
              <p className="font-bold text-slate-900 text-sm">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-1 text-slate-500">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-indigo-600" /> Payment & Status
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 text-xs text-slate-700 space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className={`font-bold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.isPaid ? 'Paid' : 'Pending Payment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Order Placed:</span>
                <span className="text-slate-900">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items list */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 flex flex-col">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
            <Package className="w-4 h-4 text-indigo-600" /> Items Ordered ({order.orderItems.length})
          </h4>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-56 pr-1">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-slate-900">
                {order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (8%):</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.taxPrice)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline font-bold text-slate-900 text-sm">
              <span>Total Paid / Due:</span>
              <span className="text-lg text-indigo-600">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/dashboard?tab=orders"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 text-center"
        >
          View in My Orders
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
