import api from './api';

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId) => {
    const { data } = await api.get(`/reviews/${productId}`);
    return data.data;
  },

  // Submit review
  createReview: async (reviewData) => {
    const { data } = await api.post('/reviews', reviewData);
    return data.data;
  },

  // Update review
  updateReview: async (id, reviewData) => {
    const { data } = await api.put(`/reviews/${id}`, reviewData);
    return data.data;
  },

  // Delete review
  deleteReview: async (id) => {
    const { data } = await api.delete(`/reviews/${id}`);
    return data;
  },
};
