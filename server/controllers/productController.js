const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Fetch all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const query = {};

    // Search keyword
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      query.price = {};
      if (req.query.minPrice !== undefined && req.query.minPrice !== '') {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice !== undefined && req.query.maxPrice !== '') {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Rating filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // In Stock filter
    if (req.query.inStock === 'true') {
      query.countInStock = { $gt: 0 };
    }

    // Featured & Best Seller filters
    if (req.query.isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (req.query.isBestSeller === 'true') {
      query.isBestSeller = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (req.query.sort === 'rating-desc') {
      sortOption = { rating: -1, numReviews: -1 };
    } else if (req.query.sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (req.query.sort === 'name-asc') {
      sortOption = { name: 1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      data: {
        products,
        page,
        pages: Math.ceil(count / pageSize) || 1,
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Fetch associated reviews
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...product.toObject(),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product categories and counts
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          image: { $first: { $arrayElemAt: ['$images', 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: categories.map((c) => ({
        name: c._id,
        count: c.count,
        image: c.image,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured and best selling products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const featured = await Product.find({ isFeatured: true }).limit(8);
    const bestSellers = await Product.find({ isBestSeller: true }).limit(8);
    const newArrivals = await Product.find({}).sort({ createdAt: -1 }).limit(8);

    res.json({
      success: true,
      data: {
        featured,
        bestSellers,
        newArrivals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      images,
      brand,
      category,
      countInStock,
      specifications,
      isFeatured,
      isBestSeller,
    } = req.body;

    if (!name || !price || !description || !brand || !category || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product fields and at least one image',
      });
    }

    const product = new Product({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      description,
      images: Array.isArray(images) ? images : [images],
      brand,
      category,
      countInStock: Number(countInStock) || 0,
      specifications: Array.isArray(specifications) ? specifications : [],
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const fields = [
      'name',
      'price',
      'originalPrice',
      'description',
      'images',
      'brand',
      'category',
      'countInStock',
      'specifications',
      'isFeatured',
      'isBestSeller',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'price' || field === 'originalPrice' || field === 'countInStock') {
          product[field] = Number(req.body[field]);
        } else {
          product[field] = req.body[field];
        }
      }
    });

    const updatedProduct = await product.save();
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete associated reviews
    await Review.deleteMany({ product: req.params.id });

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
