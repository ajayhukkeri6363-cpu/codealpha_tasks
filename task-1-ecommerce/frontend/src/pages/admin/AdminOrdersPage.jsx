import React, { useEffect, useState, useCallback } from 'react';
import {
  ShoppingCart,
  Eye,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  RotateCcw,
  User,
  MapPin,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { OrderTracker } from '../../components/OrderTracker';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useToast();

  const statusOptions = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders({
        page,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      setOrders(data.orders || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          orderStatus: newStatus,
        }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', ...statusOptions].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => {
              setStatusFilter(st);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-6">Order</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">#{order._id.substring(0, 8)}...</p>
                    <span className="text-[10px] text-slate-400">
                      {order.orderItems?.length || 0} items
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{order.shippingAddress?.fullName || 'Guest'}</p>
                    <p className="text-[10px] text-slate-400">{order.user?.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      {order.paymentMethod}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        order.isPaid ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {order.isPaid ? '● Paid' : '○ Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {/* Status Dropdown */}
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 rounded-xl px-2.5 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Inspect Order"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Inspector Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder._id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Timeline */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <OrderTracker
                status={selectedOrder.orderStatus}
                statusHistory={selectedOrder.statusHistory}
              />
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Customer Info
                </h5>
                <p><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Shipping Destination
                </h5>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pincode}</p>
                <p>{selectedOrder.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h5 className="font-bold text-slate-900 text-sm">Order Items</h5>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 bg-slate-50">
                {selectedOrder.orderItems.map((item, i) => (
                  <div key={i} className="py-2.5 px-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update Control */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="font-bold text-slate-700">Change Status:</span>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                className="bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
