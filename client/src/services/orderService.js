import api from './api';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    return data.data;
  },

  // Get current user orders
  getMyOrders: async () => {
    const { data } = await api.get('/orders/my-orders');
    return data.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const { data } = await api.put(`/orders/${id}/cancel`);
    return data.data;
  },
};
