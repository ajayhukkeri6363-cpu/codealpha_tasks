const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
