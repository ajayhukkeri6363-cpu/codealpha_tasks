import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminOverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-3xl border border-slate-100" />
      </div>
    );
  }

  if (!stats) return <div>Failed to load admin stats</div>;

  const { summary, recentOrders, categoryStats, topProducts, salesChart } = stats;

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(summary.totalRevenue)}</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Realized Sales
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{summary.totalOrders}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Processed orders</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Items</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{summary.totalProducts}</p>
            {summary.outOfStockProducts > 0 ? (
              <p className="text-[11px] text-rose-600 font-bold mt-1">
                {summary.outOfStockProducts} out of stock
              </p>
            ) : (
              <p className="text-[11px] text-emerald-600 font-bold mt-1">All in stock</p>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Users</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{summary.totalUsers}</p>
            <p className="text-[11px] text-indigo-600 font-bold mt-1">Active customer base</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Weekly Revenue Trajectory</h3>
              <p className="text-xs text-slate-400">Visual sales performance distribution</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold">
              Past 7 Days
            </span>
          </div>

          {/* Simple SVG Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 pb-2">
            {salesChart.map((point) => {
              const maxVal = Math.max(...salesChart.map((p) => p.sales), 100);
              const heightPercent = Math.max(15, Math.round((point.sales / maxVal) * 100));

              return (
                <div key={point.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${point.sales}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-xl transition-all duration-500 group-hover:brightness-110 shadow-sm"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-bold text-slate-500">{point.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Catalog By Category</h3>
          <div className="space-y-3 pt-2">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{cat.category}</span>
                  <span>{cat.count} items</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${(cat.count / summary.totalProducts) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Latest orders placed across the store</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900">
                    #{order._id.substring(0, 8)}...
                  </td>
                  <td className="py-3.5">
                    <p className="font-bold text-slate-900">{order.shippingAddress?.fullName || 'Guest'}</p>
                    <p className="text-[10px] text-slate-400">{order.user?.email}</p>
                  </td>
                  <td className="py-3.5 text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="py-3.5 font-bold text-indigo-600">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-3.5">
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
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      to={`/admin/orders`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
