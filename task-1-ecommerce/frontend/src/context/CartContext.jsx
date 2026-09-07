import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Load cart from DB (if logged in) or from localStorage (if guest)
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Check if there was guest items in localStorage to sync
        const guestCart = localStorage.getItem('shopsphere_guest_cart');
        if (guestCart) {
          try {
            const parsedGuest = JSON.parse(guestCart);
            if (Array.isArray(parsedGuest) && parsedGuest.length > 0) {
              const syncItems = parsedGuest.map((item) => ({
                product: item.product?._id || item.product,
                quantity: item.quantity,
              }));
              await cartService.syncCart(syncItems);
              localStorage.removeItem('shopsphere_guest_cart');
            }
          } catch (e) {
            console.error('Failed to sync guest cart:', e);
          }
        }

        const data = await cartService.getCart();
        setItems(data.items || []);
      } else {
        const guestCart = localStorage.getItem('shopsphere_guest_cart');
        if (guestCart) {
          setItems(JSON.parse(guestCart));
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Save guest cart to localStorage whenever items change if not authenticated
  const saveGuestCart = (newItems) => {
    setItems(newItems);
    localStorage.setItem('shopsphere_guest_cart', JSON.stringify(newItems));
  };

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    const qty = Number(quantity) || 1;

    // Check stock
    if (product.countInStock <= 0) {
      toast.error('This product is out of stock');
      return false;
    }

    if (isAuthenticated) {
      try {
        const updated = await cartService.addToCart(product._id, qty);
        setItems(updated.items || []);
        toast.success(`Added ${product.name} to your cart`);
        return true;
      } catch (err) {
        toast.error(err.message || 'Failed to add item to cart');
        return false;
      }
    } else {
      // Guest cart handling
      const existingIdx = items.findIndex(
        (item) => (item.product?._id || item.product) === product._id
      );

      let newItems = [...items];
      if (existingIdx > -1) {
        const newQty = newItems[existingIdx].quantity + qty;
        if (newQty > product.countInStock) {
          toast.error(`Only ${product.countInStock} items available in stock`);
          return false;
        }
        newItems[existingIdx] = {
          ...newItems[existingIdx],
          quantity: newQty,
        };
      } else {
        if (qty > product.countInStock) {
          toast.error(`Only ${product.countInStock} items available in stock`);
          return false;
        }
        newItems.push({
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            images: product.images,
            countInStock: product.countInStock,
            category: product.category,
            brand: product.brand,
          },
          quantity: qty,
        });
      }

      saveGuestCart(newItems);
      toast.success(`Added ${product.name} to cart`);
      return true;
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    const qty = Math.max(1, Number(quantity));

    if (isAuthenticated) {
      try {
        const updated = await cartService.updateQuantity(productId, qty);
        setItems(updated.items || []);
      } catch (err) {
        toast.error(err.message || 'Failed to update quantity');
      }
    } else {
      const newItems = items.map((item) => {
        const prodId = item.product?._id || item.product;
        if (prodId === productId) {
          const maxStock = item.product?.countInStock || 99;
          return {
            ...item,
            quantity: Math.min(qty, maxStock),
          };
        }
        return item;
      });
      saveGuestCart(newItems);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    if (isAuthenticated) {
      try {
        const updated = await cartService.removeItem(productId);
        setItems(updated.items || []);
        toast.info('Item removed from cart');
      } catch (err) {
        toast.error(err.message || 'Failed to remove item');
      }
    } else {
      const newItems = items.filter(
        (item) => (item.product?._id || item.product) !== productId
      );
      saveGuestCart(newItems);
      toast.info('Item removed from cart');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setItems([]);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      saveGuestCart([]);
    }
  };

  // Apply Coupon code
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SAVE10' || cleanCode === 'CODEALPHA') {
      setCouponCode(cleanCode);
      setDiscountPercent(10);
      toast.success('Promo coupon applied: 10% discount!');
      return true;
    } else if (cleanCode === 'SPECIAL20') {
      setCouponCode(cleanCode);
      setDiscountPercent(20);
      toast.success('Promo coupon applied: 20% discount!');
      return true;
    } else {
      toast.error('Invalid or expired coupon code. Try "SAVE10" or "CODEALPHA"');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  // Calculate pricing
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const rawSubtotal = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const subtotal = Math.round(rawSubtotal * 100) / 100;
  const discountAmount = Math.round(((subtotal * discountPercent) / 100) * 100) / 100;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  // Free shipping over $50
  const shippingPrice = subtotal > 50 || subtotal === 0 ? 0 : 10.0;
  // 8% tax
  const taxPrice = Math.round(discountedSubtotal * 0.08 * 100) / 100;
  const totalPrice = Math.round((discountedSubtotal + shippingPrice + taxPrice) * 100) / 100;

  const value = {
    items,
    loading,
    totalItems,
    subtotal,
    discountAmount,
    discountPercent,
    couponCode,
    shippingPrice,
    taxPrice,
    totalPrice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
