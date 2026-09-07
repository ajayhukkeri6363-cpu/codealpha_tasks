import api from './api';

export const adminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const { data } = await api.get('/admin/dashboard');
    return data.data;
  },

  // Get all orders
  getAllOrders: async (params = {}) => {
    const { data } = await api.get('/admin/orders', { params });
    return data.data;
  },

  // Update order status
  updateOrderStatus: async (id, statusData) => {
    const { data } = await api.put(`/admin/orders/${id}/status`, statusData);
    return data.data;
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    const { data } = await api.get('/admin/users', { params });
    return data.data;
  },

  // Update user role
  updateUserRole: async (id, role) => {
    const { data } = await api.put(`/admin/users/${id}/role`, { role });
    return data.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },
};
