import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { OrderTracker } from '../components/OrderTracker';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { formatCurrency, formatDate } from '../utils/formatters';

export const UserDashboardPage = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');
  const [country, setCountry] = useState(user?.address?.country || 'United States');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Cancel order state
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name,
        phone,
        address: { street, city, state, pincode, country },
      });
      toast.success('Profile details updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrderToCancel) return;
    setCancelling(true);
    try {
      await orderService.cancelOrder(selectedOrderToCancel._id);
      toast.success('Order cancelled successfully');
      setSelectedOrderToCancel(null);
      // Reload orders
      const data = await orderService.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const totalSpent = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalPrice, 0);
  const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Member since {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l sm:border-slate-100 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-around sm:justify-start">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders</p>
            <p className="text-xl font-extrabold text-slate-900">{orders.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered</p>
            <p className="text-xl font-extrabold text-emerald-600">{deliveredOrdersCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Spent</p>
            <p className="text-xl font-extrabold text-indigo-600">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Main Layout Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'orders', label: 'My Orders', icon: Package, badge: orders.length },
              { id: 'profile', label: 'Profile Details', icon: MapPin },
              { id: 'security', label: 'Security & Password', icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Tab Content */}
        <div className="lg:col-span-9">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">Recent Activity</h3>
                  <button
                    onClick={() => handleTabChange('orders')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All Orders
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No recent orders. <Link to="/products" className="text-indigo-600 font-bold">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 2).map((order) => (
                      <div
                        key={order._id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">#{order._id.substring(0, 10)}...</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : order.orderStatus === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-indigo-100 text-indigo-700'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Placed on {formatDate(order.createdAt)} • {order.orderItems.length} items
                          </p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-sm font-extrabold text-slate-900">
                            {formatCurrency(order.totalPrice)}
                          </span>
                          <Link
                            to={`/order-success/${order._id}`}
                            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            Track
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Address Info */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">Default Shipping Address</h3>
                  <button
                    onClick={() => handleTabChange('profile')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Edit Address
                  </button>
                </div>
                {user?.address?.street ? (
                  <div className="p-4 rounded-2xl bg-slate-50 text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p>{user.address.street}</p>
                    <p>{user.address.city}, {user.address.state} {user.address.pincode}</p>
                    <p>{user.address.country}</p>
                    <p className="text-slate-400 pt-1">Phone: {user.phone || 'Not specified'}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No saved address yet. Please add one in Profile details.</p>
                )}
              </div>
            </div>
          )}

          {/* MY ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {loadingOrders ? (
                <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs animate-pulse">
                  Loading order history...
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No Orders Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You haven't placed any orders yet. Check out our latest products!
                  </p>
                  <Link
                    to="/products"
                    className="inline-block px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-md"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            Order #{order._id.substring(0, 12)}
                          </h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-700'
                                : order.orderStatus === 'Cancelled'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Placed on {formatDate(order.createdAt)} • Paid via {order.paymentMethod}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {['Pending', 'Confirmed'].includes(order.orderStatus) && (
                          <button
                            type="button"
                            onClick={() => setSelectedOrderToCancel(order)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                        <Link
                          to={`/order-success/${order._id}`}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                        >
                          View Invoice
                        </Link>
                      </div>
                    </div>

                    {/* Visual Timeline Tracker */}
                    <OrderTracker status={order.orderStatus} statusHistory={order.statusHistory} />

                    {/* Order Items */}
                    <div className="divide-y divide-slate-100 pt-2">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{item.name}</p>
                              <p className="text-[11px] text-slate-400">
                                Qty: {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer total */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Order Grand Total</span>
                      <span className="text-base text-indigo-600">{formatCurrency(order.totalPrice)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PROFILE SETTINGS TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900">Update Profile & Default Address</h3>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Postal / Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900">Change Account Password</h3>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {changingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Cancellation */}
      <ConfirmationDialog
        isOpen={!!selectedOrderToCancel}
        onClose={() => setSelectedOrderToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? The items will be returned to store inventory."
        confirmText="Confirm Cancellation"
        loading={cancelling}
      />
    </div>
  );
};
