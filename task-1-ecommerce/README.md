# 🛒 ShopSphere — Full-Stack E-Commerce Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80" alt="ShopSphere E-Commerce Platform" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>"Discover better. Shop smarter."</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue.svg?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Node.js-20.x-green.svg?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Express-4.21-000000.svg?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%208.x-brightgreen.svg?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/License-MIT-purple.svg" alt="License" />
</p>

---

## 📌 Project Overview
**ShopSphere** is a modern e-commerce web application engineered for **Task 1 of the CodeAlpha Full Stack Development Internship**. It includes dynamic catalog browsing, multi-facet filtering, shopping cart state management, promo code calculation (`SAVE10`), a 3-step checkout process, interactive order tracking, verified customer reviews, and a role-based administrative control panel.

---

## ✨ Features Breakdown

### Customer Portal
- **Catalog Filtering**: Real-time debounced text search, category tabs (`Electronics`, `Clothing`, `Shoes`, `Accessories`, `Home & Kitchen`), rating filters, price range sliders, and multi-sort.
- **Product Details**: High-resolution image zoom, stock level indicators, customer ratings breakdown, and verified review submission.
- **Cart & Pricing**: Live subtotal calculation, free shipping progress meter ($50 threshold), coupon discounts (`SAVE10` for 10% off), and quantity steppers.
- **3-Step Checkout Flow**: Shipping address validation, payment selection (Credit Card, PayPal, Cash on Delivery), and order review.
- **Visual Order Tracking**: Interactive step-by-step timeline (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
- **User Dashboard**: Order history table, delivery status, and profile information.

### Admin Portal
- **Sales Analytics**: High-level revenue metric cards, total orders, product counts, and recent transactions.
- **Product CRUD**: Create, edit, and delete products with stock management.
- **Order Lifecycle Management**: Switch order statuses (`Pending`, `Processing`, `Shipped`, `Delivered`) with immediate timeline reflections.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Axios, React Router 6
- **Backend**: Node.js, Express.js 4, Mongoose 8.x, JWT Authentication, Bcrypt.js
- **Database**: MongoDB (with automated `mongodb-memory-server` in-memory fallback)

---

## 🚀 Port Mapping & Environment Variables

| Service | Port | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5173` | React + Vite UI |
| **Backend REST API** | `http://localhost:5000` | Express REST APIs |

### Backend `.env` Configuration
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shopsphere_db
JWT_SECRET=shopsphere_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

---

## 🔑 Evaluator Demo Credentials

| Role / Persona | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@shopsphere.com` | `admin123` | Full Admin Portal Access (CRUD, Analytics, Order Status) |
| **Customer User** | `user@shopsphere.com` | `user123` | Storefront, Cart, Checkout, Order Tracking |

> **Note**: These credentials are demo accounts created specifically for local/project evaluation.

---

## 📦 Quick Start Guide

```bash
# 1. Start Backend (Port 5000)
cd backend
npm install
npm start

# 2. Start Frontend (Port 5173) in a new terminal
cd ../frontend
npm install
npm run dev
```

---

## 📡 REST API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/products` | Public | List products with search, category & filters |
| `GET` | `/api/products/:id` | Public | Get product details & reviews |
| `POST` | `/api/products/:id/reviews` | Private | Submit customer review |
| `POST` | `/api/cart` | Private | Add / modify cart items |
| `GET` | `/api/cart` | Private | Get user shopping cart |
| `POST` | `/api/orders` | Private | Create order & decrement stock inventory |
| `GET` | `/api/orders/myorders` | Private | Fetch logged-in user order history |
| `GET` | `/api/admin/dashboard` | Admin | Get sales revenue & analytics summary |
| `PUT` | `/api/admin/orders/:id/status` | Admin | Update order delivery lifecycle status |

---

## 🎬 Video Demo Walkthrough Script (2–4 Minutes)

1. **Storefront Landing (0:00 - 0:30)**:
   * Open `http://localhost:5173`. Show the hero banner, category carousels, and the 20 pre-seeded products.
2. **Search & Filter (0:30 - 1:00)**:
   * Type "Sony" into the search bar. Filter by "Electronics" and adjust the price slider.
3. **Product Details & Reviews (1:00 - 1:30)**:
   * Click on the Sony Headphones product card. Show specifications, stock badges, and customer reviews.
4. **Cart & Promo Code (1:30 - 2:00)**:
   * Add item to cart, open slide-over cart drawer, and apply promo coupon `SAVE10` to observe 10% discount.
5. **Checkout & Order Placement (2:00 - 2:45)**:
   * Click Checkout. Fill the 3-step form, place the order, and show the visual order tracking timeline (`Delivered` / `Shipped`).
6. **Admin Dashboard (2:45 - 3:30)**:
   * Log in with `admin@shopsphere.com` / `admin123`. Show sales revenue analytics, product inventory, and order status updates.

---

## 🚀 Deployment Readiness & Environment

* **Deployment Tier**: `PRODUCTION READY` (Tested locally with embedded MongoDB; ready for containerization/Vercel/Render).
* **Frontend**: Deployable to **Vercel / Netlify** with `npm run build` (output directory: `dist/`). Set `VITE_API_URL` to backend URL.
* **Backend**: Deployable to **Render / Railway / AWS ECS** with `npm start`. Set `PORT`, `MONGODB_URI`, and `JWT_SECRET`.
* **Database**: Embedded in-memory MongoDB is active for zero-config local runs. For cloud production, provide a MongoDB Atlas cluster URI in `MONGODB_URI`.

---

## ⚠️ Known Limitations & Future Roadmap
- Stripe payment gateway is currently simulated via client-side card validation for zero-dependency local testing.
- Future roadmap includes multi-currency support and automated email receipts.