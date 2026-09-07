const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const { connectDB } = require('../config/db');

dotenv.config();

const usersData = [
  {
    name: 'Admin Alexander',
    email: 'admin@shopsphere.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    address: {
      street: '100 Innovation Way, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      pincode: '94107',
      country: 'United States',
    },
  },
  {
    name: 'Sarah Connor',
    email: 'user@shopsphere.com',
    password: 'user123',
    role: 'user',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    address: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      pincode: '97477',
      country: 'United States',
    },
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@example.com',
    password: 'user123',
    role: 'user',
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    address: {
      street: '456 Elm Street, Apt 3B',
      city: 'Seattle',
      state: 'WA',
      pincode: '98101',
      country: 'United States',
    },
  },
];

const productsData = [
  // --- ELECTRONICS ---
  {
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    description: 'Industry-leading noise canceling with two processors and 8 microphones for unprecedented noise cancellation. Crystal clear hands-free calling with 4 beamforming microphones, and up to 30-hour battery life with quick charging.',
    price: 349.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'Sony',
    countInStock: 25,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 18,
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { key: 'Driver Unit', value: '30mm, Dome type (CCAW Voice coil)' },
      { key: 'Battery Life', value: 'Up to 30 hours with ANC on' },
      { key: 'Bluetooth Version', value: '5.2 (LDAC, AAC, SBC)' },
      { key: 'Weight', value: '250g' },
    ],
  },
  {
    name: 'Apple MacBook Pro 16" (M3 Max, 36GB RAM, 1TB SSD)',
    description: 'The most advanced Mac laptop ever. Powered by the M3 Max chip with a 14-core CPU and 30-core GPU, Liquid Retina XDR display with 1600 nits peak brightness, and all-day 22-hour battery life.',
    price: 2499.0,
    originalPrice: 2899.0,
    category: 'Electronics',
    brand: 'Apple',
    countInStock: 12,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 32,
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { key: 'Processor', value: 'Apple M3 Max (14-Core CPU, 30-Core GPU)' },
      { key: 'Memory', value: '36GB Unified Memory' },
      { key: 'Storage', value: '1TB Superfast NVMe SSD' },
      { key: 'Display', value: '16.2-inch Liquid Retina XDR (3456 x 2234)' },
    ],
  },
  {
    name: 'Apple Watch Ultra 2 Titanium GPS + Cellular 49mm',
    description: 'The most rugged and capable Apple Watch. Engineered for outdoor adventures and endurance workouts with a lightweight aerospace-grade titanium case, precision dual-frequency GPS, and up to 36 hours of battery life.',
    price: 749.0,
    originalPrice: 799.0,
    category: 'Electronics',
    brand: 'Apple',
    countInStock: 18,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 14,
    isFeatured: true,
    isBestSeller: false,
    specifications: [
      { key: 'Case Material', value: 'Aerospace-Grade Titanium' },
      { key: 'Water Resistance', value: '100m / EN13319 Dive Certified' },
      { key: 'Display', value: '3000 nits Always-On OLED' },
      { key: 'Connectivity', value: 'LTE, Wi-Fi, Bluetooth 5.3, UWB Gen 2' },
    ],
  },
  {
    name: 'Sony Alpha a7 IV Full-Frame Mirrorless Camera',
    description: 'An all-around hybrid camera featuring a 33MP Exmor R CMOS sensor, 4K 60p 10-bit recording, advanced AI real-time autofocus with human/animal/bird eye tracking, and 5-axis in-body image stabilization.',
    price: 2198.0,
    originalPrice: 2498.0,
    category: 'Electronics',
    brand: 'Sony',
    countInStock: 8,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 9,
    isFeatured: false,
    isBestSeller: false,
    specifications: [
      { key: 'Sensor', value: '33MP Full-Frame Exmor R BSI CMOS' },
      { key: 'Video', value: '4K 60p 10-bit 4:2:2, S-Cinetone' },
      { key: 'Autofocus', value: '759 Phase-Detection AF points' },
      { key: 'Stabilization', value: '5.5-stop 5-Axis SteadyShot INSIDE' },
    ],
  },
  {
    name: 'Bose SoundLink Flex Bluetooth Portable Speaker',
    description: 'Astonishing sound engineered for waterproof durability. With PositionIQ technology that automatically optimizes sound orientation and IP67 waterproof & dustproof rating that even floats in water.',
    price: 129.0,
    originalPrice: 149.0,
    category: 'Electronics',
    brand: 'Bose',
    countInStock: 40,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.6,
    numReviews: 22,
    isFeatured: false,
    isBestSeller: true,
    specifications: [
      { key: 'Waterproof Rating', value: 'IP67 Waterproof & Floatable' },
      { key: 'Battery', value: 'Up to 12 hours playtime' },
      { key: 'Charging', value: 'USB-C Fast Charging' },
      { key: 'Wireless Range', value: 'Up to 30 ft (9m)' },
    ],
  },

  // --- CLOTHING ---
  {
    name: 'Urban Techwear All-Weather Waterproof Hooded Shell',
    description: 'Engineered for metropolitan commute and mountain excursions. 3-layer breathable Gore-Tex fabric with sealed seam zippers, magnetic quick-release storm flap, and ergonomic articulated sleeve design.',
    price: 189.0,
    originalPrice: 249.0,
    category: 'Clothing',
    brand: 'AcroUrban',
    countInStock: 30,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 15,
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { key: 'Material', value: '3-Layer Ripstop Nylon + TPU Membrane' },
      { key: 'Waterproof Rating', value: '20,000mm hydrostatic head' },
      { key: 'Fit', value: 'Modern Athletic Fit' },
      { key: 'Care', value: 'Machine wash cold delicate' },
    ],
  },
  {
    name: 'Heavyweight French Terry Oversized Streetwear Hoodie',
    description: 'Crafted from 480 GSM 100% organic French Terry cotton with double-lined hood, ribbed side gussets, dropped shoulders, and pre-shrunk luxury enzyme wash for supreme comfort.',
    price: 79.99,
    originalPrice: 110.0,
    category: 'Clothing',
    brand: 'MinimalThread',
    countInStock: 50,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 29,
    isFeatured: false,
    isBestSeller: true,
    specifications: [
      { key: 'Fabric Weight', value: '480 GSM Heavyweight French Terry' },
      { key: 'Composition', value: '100% Combed Organic Cotton' },
      { key: 'Fit', value: 'Relaxed / Oversized Boxy Cut' },
    ],
  },
  {
    name: 'Classic Tailored Italian Cotton Oxford Button-Down Shirt',
    description: 'A timeless staple woven from 100% long-staple Egyptian cotton with a gentle garment wash. Features mother-of-pearl buttons, single chest pocket, and reinforced split yoke for lasting durability.',
    price: 65.0,
    originalPrice: 85.0,
    category: 'Clothing',
    brand: 'Sartorial Co.',
    countInStock: 35,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.6,
    numReviews: 11,
    isFeatured: false,
    isBestSeller: false,
    specifications: [
      { key: 'Material', value: '100% Egyptian Giza Cotton' },
      { key: 'Collar', value: 'Button-Down Collar with 3.25" points' },
      { key: 'Fit', value: 'Tailored Slim Fit' },
    ],
  },
  {
    name: 'Vintage Washed Sherpa Lined Denim Trucker Jacket',
    description: 'Heavyweight 14oz raw selvedge denim treated with a vintage stone-wash patina, lined throughout the torso with plush warm faux sherpa fleece for unmatched cold-weather style.',
    price: 135.0,
    originalPrice: 175.0,
    category: 'Clothing',
    brand: 'IronForge Denim',
    countInStock: 20,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 16,
    isFeatured: true,
    isBestSeller: false,
    specifications: [
      { key: 'Outer Shell', value: '14oz 100% Cotton Denim' },
      { key: 'Lining', value: 'High-Pile Thermal Sherpa Fleece' },
      { key: 'Hardware', value: 'Antique Brass Shank Buttons' },
    ],
  },

  // --- SHOES ---
  {
    name: 'Nike Air Zoom Pegasus 41 Running Shoes',
    description: 'Responsive cushioning in the Pegasus provides an energized ride for everyday road running. Experience lighter-weight energy return with dual Air Zoom units and a ReactX foam midsole.',
    price: 139.99,
    originalPrice: 160.0,
    category: 'Shoes',
    brand: 'Nike',
    countInStock: 28,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 24,
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { key: 'Cushioning', value: 'ReactX Foam + Forefoot & Heel Air Zoom' },
      { key: 'Heel-to-Toe Drop', value: '10 mm' },
      { key: 'Upper', value: 'Engineered breathable mesh' },
      { key: 'Weight', value: '297g (Men size 10)' },
    ],
  },
  {
    name: 'Classic Goodyear-Welted Italian Chelsea Leather Boots',
    description: 'Handcrafted in Tuscany from full-grain calfskin leather with elasticated side gussets, pull tabs, cushioned cork footbed, and a durable Vibram rubber commando sole.',
    price: 260.0,
    originalPrice: 320.0,
    category: 'Shoes',
    brand: 'Artigiano',
    countInStock: 15,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 19,
    isFeatured: true,
    isBestSeller: false,
    specifications: [
      { key: 'Construction', value: 'Goodyear Welted (Fully Resolable)' },
      { key: 'Leather', value: 'Full-Grain Italian Calfskin' },
      { key: 'Sole', value: 'Vibram Morflex Lug Sole' },
    ],
  },
  {
    name: 'Minimalist Monochrome Low-Top Leather Sneakers',
    description: 'Handcrafted minimalist luxury sneaker. Buttery smooth nappa leather upper, stitched Margom rubber cupsole, and vegetable-tanned calfskin lining for breathable barefoot comfort.',
    price: 145.0,
    originalPrice: 185.0,
    category: 'Shoes',
    brand: 'Essentiel',
    countInStock: 22,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 13,
    isFeatured: false,
    isBestSeller: true,
    specifications: [
      { key: 'Upper', value: 'Full-Grain White Nappa Leather' },
      { key: 'Sole', value: 'Italian Margom Rubber Cupsole' },
      { key: 'Insole', value: 'Removable Arch-Support Ortholite' },
    ],
  },

  // --- ACCESSORIES ---
  {
    name: 'Full-Grain Waxed Canvas & Leather Travel Backpack (28L)',
    description: 'Built to endure generations of travel. Weather-resistant Martexin 18oz waxed canvas with 4mm bridle leather straps, padded 16-inch laptop compartment, and luggage pass-through strap.',
    price: 195.0,
    originalPrice: 240.0,
    category: 'Accessories',
    brand: 'Heritage Supply',
    countInStock: 16,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 21,
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { key: 'Capacity', value: '28 Liters (Expandable to 32L)' },
      { key: 'Laptop Sleeve', value: 'Suspended padded sleeve fits up to 16"' },
      { key: 'Hardware', value: 'Solid Sand-Casted Brass Buckles' },
    ],
  },
  {
    name: 'Polarized Aviator Sunglasses (Titanium Frame & UV400)',
    description: 'Ultra-lightweight Japanese titanium frames weighing only 18 grams. Scratch-resistant polarized mineral glass lenses providing 100% UV400 and blue light filtration.',
    price: 110.0,
    originalPrice: 150.0,
    category: 'Accessories',
    brand: 'Optik Studio',
    countInStock: 45,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.6,
    numReviews: 17,
    isFeatured: false,
    isBestSeller: false,
    specifications: [
      { key: 'Frame', value: 'Beta-Titanium with silicone nose pads' },
      { key: 'Lens', value: 'Polarized HD Mineral Glass UV400' },
      { key: 'Weight', value: '18.4 grams' },
    ],
  },
  {
    name: 'Minimalist RFID-Blocking Slim Leather Cardholder Wallet',
    description: 'Holds up to 8 cards plus folded currency with a smart pull-tab mechanism for swift access. Built-in RFID protection layer safeguards your credentials from contactless skimming.',
    price: 45.0,
    originalPrice: 60.0,
    category: 'Accessories',
    brand: 'Nomad Goods',
    countInStock: 60,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606503829029-7c87c12643a6?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 38,
    isFeatured: false,
    isBestSeller: true,
    specifications: [
      { key: 'Dimensions', value: '10.2cm x 7.3cm x 0.6cm' },
      { key: 'Capacity', value: '6-8 Cards + Cash' },
      { key: 'Material', value: 'Horween Vegetable-Tanned Leather' },
    ],
  },
  {
    name: 'Chronograph Automatic Stainless Steel Dress Watch',
    description: 'Sophisticated timekeeping powered by a 24-jewel automatic movement visible through the sapphire crystal exhibition caseback. 40mm 316L stainless steel case with crocodile-grain leather strap.',
    price: 380.0,
    originalPrice: 480.0,
    category: 'Accessories',
    brand: 'Kronos',
    countInStock: 14,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 12,
    isFeatured: true,
    isBestSeller: false,
    specifications: [
      { key: 'Movement', value: 'Japanese Automatic 24-Jewel (41h reserve)' },
      { key: 'Glass', value: 'Anti-Reflective Sapphire Crystal' },
      { key: 'Water Resistance', value: '5 ATM (50 meters)' },
    ],
  },

  // --- HOME & KITCHEN ---
  {
    name: 'Breville Barista Touch Impress Espresso Machine',
    description: 'Third wave specialty coffee with automated touch screen control. Features thermo-jet heating reaching optimal extraction temperature in 3 seconds, precision conical burr grinder, and automated microfoam milk texturing.',
    price: 899.95,
    originalPrice: 999.95,
    category: 'Home & Kitchen',
    brand: 'Breville',
    countInStock: 10,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 27,
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { key: 'Heating System', value: 'ThermoJet 3-second rapid heatup' },
      { key: 'Grinder', value: 'Integrated Stainless Steel Conical Burr' },
      { key: 'Pressure', value: '15 Bar Italian Pump with 9 Bar extraction' },
      { key: 'Water Tank', value: '2.0L (68 fl oz) removable tank' },
    ],
  },
  {
    name: 'Vitamix Professional Series 750 Smart High-Speed Blender',
    description: 'The pinnacle of culinary blending. 2.2 horsepower motor pulverizes whole foods effortlessly with 5 pre-programmed settings for smoothies, hot soups, frozen desserts, purees, and self-cleaning.',
    price: 549.95,
    originalPrice: 629.95,
    category: 'Home & Kitchen',
    brand: 'Vitamix',
    countInStock: 16,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 31,
    isFeatured: false,
    isBestSeller: true,
    specifications: [
      { key: 'Motor', value: 'Commercial-Grade 2.2 Peak HP' },
      { key: 'Container', value: '64 oz Low-Profile BPA-Free Eastman Tritan' },
      { key: 'Blades', value: 'Laser-Cut Hardened Stainless Steel' },
    ],
  },
  {
    name: 'Japanese 67-Layer Damascus VG-10 8" Chef Knife',
    description: 'Precision forged from high-carbon Japanese VG-10 super steel encased in 66 layers of folded Damascus steel. Hand-sharpened to a razor-sharp 15-degree edge with ergonomic G10 military-grade handle.',
    price: 119.0,
    originalPrice: 159.0,
    category: 'Home & Kitchen',
    brand: 'Kagami Forge',
    countInStock: 25,
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 19,
    isFeatured: true,
    isBestSeller: false,
    specifications: [
      { key: 'Core Steel', value: 'Japanese VG-10 High Carbon Steel (60+ HRC)' },
      { key: 'Cladding', value: '67-Layer Damascus Pattern' },
      { key: 'Blade Angle', value: '15° per side (Honbazuke Honed)' },
    ],
  },
  {
    name: 'Digital Touchscreen XL 6-in-1 Air Fryer & Roaster (6.8 Qt)',
    description: '360° rapid hot air circulation cooks food with up to 85% less oil while locking in deep crispy textures. 12 one-touch presets with dishwasher-safe ceramic non-stick crisper basket.',
    price: 109.99,
    originalPrice: 149.99,
    category: 'Home & Kitchen',
    brand: 'ChefWave',
    countInStock: 30,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 20,
    isFeatured: false,
    isBestSeller: true,
    specifications: [
      { key: 'Capacity', value: '6.8 Quarts (Feeds 4-6 people)' },
      { key: 'Power', value: '1800W Turbo Air Circulator' },
      { key: 'Temperature', value: '170°F – 400°F (75°C - 205°C)' },
    ],
  },
];

const sampleReviews = [
  {
    rating: 5,
    comment: 'Absolutely blown away by the build quality and performance! Exceeded every expectation. Highly recommend to everyone.',
  },
  {
    rating: 5,
    comment: 'Top tier product. Arrived within 2 days with crisp packaging. Worth every single cent.',
  },
  {
    rating: 4,
    comment: 'Very solid item! Great ergonomics and aesthetic design. Minus one star only because the delivery took a day longer.',
  },
];

const seedData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('[Seeder] Cleaning existing collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Cart.deleteMany({});

    console.log('[Seeder] Inserting sample users...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    const adminUser = createdUsers[0];
    const customerUser = createdUsers[1];
    const secondUser = createdUsers[2];

    console.log(`[Seeder] Created ${createdUsers.length} users (Admin: ${adminUser.email}, Demo: ${customerUser.email})`);

    console.log('[Seeder] Inserting sample products...');
    const createdProducts = [];
    for (const p of productsData) {
      const slug =
        p.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '') +
        '-' +
        Math.floor(1000 + Math.random() * 9000);
      const prod = await Product.create({ ...p, slug });
      createdProducts.push(prod);
    }
    console.log(`[Seeder] Created ${createdProducts.length} products across 5 categories.`);

    console.log('[Seeder] Attaching sample reviews...');
    for (let i = 0; i < Math.min(6, createdProducts.length); i++) {
      const prod = createdProducts[i];
      const reviewer = i % 2 === 0 ? customerUser : secondUser;
      const reviewSample = sampleReviews[i % sampleReviews.length];

      await Review.create({
        user: reviewer._id,
        userName: reviewer.name,
        userAvatar: reviewer.avatar,
        product: prod._id,
        rating: reviewSample.rating,
        comment: reviewSample.comment,
      });
    }

    console.log('[Seeder] Creating sample past customer orders...');
    // Create completed order for demo user
    const order1 = new Order({
      user: customerUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          quantity: 1,
          price: createdProducts[0].price,
          image: createdProducts[0].images[0],
        },
        {
          product: createdProducts[6]._id,
          name: createdProducts[6].name,
          quantity: 2,
          price: createdProducts[6].price,
          image: createdProducts[6].images[0],
        },
      ],
      shippingAddress: {
        fullName: customerUser.name,
        phone: customerUser.phone,
        address: customerUser.address.street,
        city: customerUser.address.city,
        state: customerUser.address.state,
        pincode: customerUser.address.pincode,
        country: customerUser.address.country,
      },
      paymentMethod: 'Cash on Delivery',
      itemsPrice: Math.round((createdProducts[0].price + createdProducts[6].price * 2) * 100) / 100,
      taxPrice: 28.5,
      shippingPrice: 0.0,
      totalPrice: Math.round((createdProducts[0].price + createdProducts[6].price * 2 + 28.5) * 100) / 100,
      orderStatus: 'Delivered',
      isPaid: true,
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Confirmed', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), note: 'Order placed' },
        { status: 'Processing', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), note: 'Packed at warehouse' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), note: 'Handed over to carrier' },
        { status: 'Delivered', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), note: 'Delivered to customer doorstep' },
      ],
    });
    await order1.save();

    // Create in-progress order for demo user
    const order2 = new Order({
      user: customerUser._id,
      orderItems: [
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          quantity: 1,
          price: createdProducts[1].price,
          image: createdProducts[1].images[0],
        },
      ],
      shippingAddress: {
        fullName: customerUser.name,
        phone: customerUser.phone,
        address: customerUser.address.street,
        city: customerUser.address.city,
        state: customerUser.address.state,
        pincode: customerUser.address.pincode,
        country: customerUser.address.country,
      },
      paymentMethod: 'Demo Card / Online',
      itemsPrice: createdProducts[1].price,
      taxPrice: 199.92,
      shippingPrice: 0.0,
      totalPrice: Math.round((createdProducts[1].price + 199.92) * 100) / 100,
      orderStatus: 'Shipped',
      isPaid: true,
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isDelivered: false,
      statusHistory: [
        { status: 'Confirmed', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Order paid online' },
        { status: 'Processing', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Verified by fulfillment center' },
        { status: 'Shipped', timestamp: new Date(), note: 'In transit via FedEx Express #FX98234190' },
      ],
    });
    await order2.save();

    console.log('[Seeder] Database successfully seeded with rich products, reviews, and test orders!');
    return true;
  } catch (err) {
    console.error(`[Seeder Error]: ${err.message}`);
    throw err;
  }
};

// Check if run directly from CLI
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seeding completed successfully. Exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedData;
