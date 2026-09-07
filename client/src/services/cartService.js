import api from './api';

export const cartService = {
  // Fetch user cart
  getCart: async () => {
    const { data } = await api.get('/cart');
    return data.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, quantity });
    return data.data;
  },

  // Update item quantity
  updateQuantity: async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    return data.data;
  },

  // Remove item
  removeItem: async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    return data.data;
  },

  // Clear cart
  clearCart: async () => {
    const { data } = await api.delete('/cart');
    return data.data;
  },

  // Sync guest cart
  syncCart: async (items) => {
    const { data } = await api.post('/cart/sync', { items });
    return data.data;
  },
};
