import api from './api';

export const productService = {
  // Fetch products with filters & pagination
  getProducts: async (params = {}) => {
    const { data } = await api.get('/products', { params });
    return data.data;
  },

  // Fetch product by ID
  getProductById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  },

  // Fetch categories
  getCategories: async () => {
    const { data } = await api.get('/products/categories');
    return data.data;
  },

  // Fetch featured / bestseller products
  getFeaturedProducts: async () => {
    const { data } = await api.get('/products/featured');
    return data.data;
  },

  // (Admin) Create product
  createProduct: async (productData) => {
    const { data } = await api.post('/products', productData);
    return data.data;
  },

  // (Admin) Update product
  updateProduct: async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data.data;
  },

  // (Admin) Delete product
  deleteProduct: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};
