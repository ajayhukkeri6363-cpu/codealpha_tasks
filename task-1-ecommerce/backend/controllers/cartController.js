const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to get formatted cart response
const getPopulatedCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price originalPrice images countInStock category brand',
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Filter out any products that might have been deleted from database
  cart.items = cart.items.filter((item) => item.product != null);
  await cart.save();

  return cart;
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cart = await getPopulatedCart(req.user._id);

    // Calculate subtotal
    const subtotal = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        totalItems: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal: Math.round(subtotal * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a productId',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.countInStock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is currently out of stock',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const qtyToAdd = Number(quantity);

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + qtyToAdd;
      if (newQuantity > product.countInStock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.countInStock} items available in stock.`,
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      if (qtyToAdd > product.countInStock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.countInStock} items available in stock.`,
        });
      }
      cart.items.push({
        product: productId,
        quantity: qtyToAdd,
      });
    }

    await cart.save();
    const updatedCart = await getPopulatedCart(req.user._id);

    res.json({
      success: true,
      message: 'Item added to cart',
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (qty > product.countInStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.countInStock} units available in stock`,
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart.items[itemIndex].quantity = qty;
    await cart.save();

    const updatedCart = await getPopulatedCart(req.user._id);
    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove single item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    const updatedCart = await getPopulatedCart(req.user._id);
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: { items: [], totalItems: 0, subtotal: 0 },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync guest cart with user cart on login
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    for (const item of items) {
      const product = await Product.findById(item.product || item._id);
      if (product && product.countInStock > 0) {
        const existingIdx = cart.items.findIndex(
          (ci) => ci.product.toString() === product._id.toString()
        );

        const qty = Math.min(item.quantity || 1, product.countInStock);

        if (existingIdx > -1) {
          cart.items[existingIdx].quantity = Math.min(
            cart.items[existingIdx].quantity + qty,
            product.countInStock
          );
        } else {
          cart.items.push({
            product: product._id,
            quantity: qty,
          });
        }
      }
    }

    await cart.save();
    const updatedCart = await getPopulatedCart(req.user._id);

    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
};
