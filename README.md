# ShopSphere — Full Stack E-Commerce Platform

[![CodeAlpha Internship](https://img.shields.io/badge/CodeAlpha-Full_Stack_Internship_Task_1-4f46e5.svg)](https://codealpha.tech)
[![React](https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_+_Express-339933.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_+_Mongoose-47A248.svg)](https://www.mongodb.com/)
[![JWT Auth](https://img.shields.io/badge/Security-JWT_+_Bcrypt-000000.svg)](https://jwt.io/)

ShopSphere is an industry-standard, production-quality full-stack e-commerce web application engineered for the **CodeAlpha Full Stack Development Internship (TASK 1: Simple E-commerce Store)**.

The system is built on the **MERN** stack (MongoDB, Express, React, Node.js) with a modern Vite frontend, Tailwind CSS, Lucide icons, JWT authentication, role-based authorization, live catalog filtering, stock management, reviews, and interactive Admin and User dashboards.

---

## Key Highlights

* **Zero-Friction Local Setup**: Embedded MongoDB Memory Server fallback automatically initializes if a local MongoDB server is not running, ensuring 100% out-of-the-box evaluation without database configuration.
* **Real Full-Stack Architecture**: Complete REST API with 20+ endpoints, Mongoose schema models, transactions, validations, and real-time inventory decrementing.
* **One-Click Demo Authentication**: Instantly login as **Super Admin** or **Demo Customer** directly from the sign-in page for rapid evaluation.
* **Enterprise Security**: Password hashing with `bcryptjs` (salt 10), JWT Bearer token authentication, protected routes, admin role guards, and sanitized error responses.

---

## System Architecture

```
CodeAlpha_ShopSphere/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets & favicons
│   ├── src/
│   │   ├── components/         # ProductCard, RatingStars, OrderTracker,
│   │   │                       # Modal, ConfirmationDialog, SkeletonLoader
│   │   ├── context/            # AuthContext, CartContext, ToastContext
│   │   ├── hooks/              # useAuth, useCart, useToast, useDebounce
│   │   ├── layouts/            # Navbar, Footer, MainLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── admin/          # AdminOverviewPage, AdminProductsPage,
│   │   │   │                   # AdminOrdersPage, AdminUsersPage
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   ├── UserDashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/           # Axios API services (auth, product, cart, order, review, admin)
│   │   ├── utils/              # Currency/date formatters
│   │   ├── App.jsx             # React Router routing & guards
│   │   ├── main.jsx            # React root bootstrap
│   │   └── index.css           # Tailwind directives & theme styles
│   ├── index.html
│   ├── vite.config.js          # Dev server & API proxy
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose & Memory-Server Manager
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile, password change
│   │   ├── productController.js# Filter, search, paginate, CRUD
│   │   ├── cartController.js   # Persistent cart management & stock validation
│   │   ├── orderController.js  # Order placement, inventory decrement, cancel
│   │   ├── reviewController.js # Product rating aggregations & duplicate prevention
│   │   └── adminController.js  # Analytics, metrics, user directory & roles
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect & admin role check
│   │   └── errorMiddleware.js  # Global error handler & 404 handler
│   ├── models/
│   │   ├── User.js             # User model with bcrypt encryption
│   │   ├── Product.js          # Product model with stock, specs & categories
│   │   ├── Order.js            # Order model with status history & invoice items
│   │   ├── Review.js           # Review model with compound index uniqueness
│   │   └── Cart.js             # User cart model
│   ├── routes/                 # Express REST route modules
│   ├── utils/
│   │   ├── generateToken.js    # JWT generator
│   │   └── seeder.js           # Rich 20+ product catalog seeder
│   ├── server.js               # Express application entrypoint
│   ├── .env.example
│   └── package.json
│
├── .env.example                # Root environment template
├── .gitignore
├── package.json                # Monorepo concurrency script runner
└── README.md                   # Complete documentation
```

---

## Core Features & Modules

### 1. User Authentication & Profile
- User registration with validation
- Secure login with bcrypt password comparison
- JWT token authentication with 30-day expiry
- Persistent session storage in `localStorage`
- Customer Profile Management: update name, phone number, shipping address
- Change Password with verification of old credentials
- Role-based authorization (`user` vs `admin`)

### 2. Catalog & Product Discovery
- 20+ realistic products across 5 categories: **Electronics**, **Clothing**, **Shoes**, **Accessories**, **Home & Kitchen**
- Real-time search with instant debounced backend queries
- Multi-facet sidebar filters: Category, Price Range slider, Minimum Rating, In-Stock only
- Sorting options: Newest Arrivals, Price: Low to High, Price: High to Low, Highest Rated
- Server-side pagination and responsive Grid/List views

### 3. Product Details & Interactive Reviews
- Multi-image gallery with high-resolution image zoom and thumbnail selector
- Live inventory indicator (`In Stock (X left)` / `Out of Stock`)
- Quantity stepper bounded strictly by available stock
- Full technical specifications table
- Verified reviews system with 1-5 star ratings, feedback comments, score distribution bars, and duplicate review prevention

### 4. Shopping Cart & Checkout
- Persistent cart for authenticated users, with guest localStorage fallback and auto-sync on login
- Real-time stock limit bounds checking
- Free shipping progress meter (Free shipping on orders over $50)
- Promo discount coupon support (e.g. `SAVE10` for 10% off, `SPECIAL20` for 20% off)
- 3-Step Checkout with shipping address form, Cash on Delivery / Demo Online Payment, and instant stock deduction

### 5. Order Management & Real-Time Tracking
- Order confirmation invoice screen
- Visual 4-step status timeline tracker (`Confirmed` → `Processing` → `Shipped` → `Delivered` / `Cancelled`)
- Customer order cancellation before shipping (with automatic stock restoration)
- Full order history in User Dashboard

### 6. Admin Control Center
- **Analytics Overview**: Real-time revenue metrics, total orders, product counts, registered users, weekly sales charts, and category distribution
- **Product Inventory Management**: Add new products with specifications & images, edit prices/stock, delete products, and inline stock updates
- **Order Processing**: Filter orders by status, change order status (`Pending` → `Delivered`), and inspect customer details
- **User Management**: User directory with role changer (`User` ↔ `Admin`) and account moderation

---

## Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@shopsphere.com` | `admin123` | Full access to Admin Dashboard, Product CRUD, Order Statuses, User Roles |
| **Demo Customer** | `user@shopsphere.com` | `user123` | Store shopping, Cart, Checkout, Order History, Reviews, Profile |
| **Demo Customer 2** | `marcus@example.com` | `user123` | Store shopping, Order placement, Reviews |

> *Tip: You can click the "👑 Demo Admin" or "👤 Demo Customer" one-click login buttons on the Sign In page for instant authentication.*

---

## Quick Start / Installation Guide

### Prerequisites
* **Node.js** (v18.0.0 or later)
* **npm** (v9.0.0 or later)
* *(Optional)* MongoDB locally or MongoDB Atlas URI (if not provided, the embedded MongoDB Memory Server will launch automatically).

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CodeAlpha_ShopSphere.git
cd CodeAlpha_ShopSphere
```

### 2. Install Dependencies
Install all root, backend, and frontend dependencies:
```bash
# Root & Concurrently
npm install

# Backend dependencies
npm install --prefix server

# Frontend dependencies
npm install --prefix client
```

### 3. Configure Environment Variables
Create `.env` inside `server/` (or copy from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/shopsphere
JWT_SECRET=shopsphere_super_secret_jwt_key_2025_codealpha_fullstack
CLIENT_URL=http://localhost:5173
```

### 4. Seed Database (Optional)
The database auto-seeds on first launch if empty, but you can re-seed anytime with:
```bash
npm run seed
```

### 5. Run the Application
Run both backend API and frontend client concurrently with a single command:
```bash
npm run dev
```

* **Frontend Client**: [http://localhost:5173](http://localhost:5173)
* **Backend REST API**: [http://localhost:5000](http://localhost:5000)
* **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## REST API Specification

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user profile & default address |
| `PUT` | `/api/auth/change-password` | Private | Change password with old password verification |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Get products with search, category, price, rating, sorting & pagination |
| `GET` | `/api/products/categories` | Public | Get distinct categories with product counts |
| `GET` | `/api/products/featured` | Public | Get featured & best-selling products |
| `GET` | `/api/products/:id` | Public | Get single product details by ID |
| `POST` | `/api/products` | Admin | Create a new product |
| `PUT` | `/api/products/:id` | Admin | Update product details & stock |
| `DELETE` | `/api/products/:id` | Admin | Delete product |

### Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Private | Get user's cart populated with product info |
| `POST` | `/api/cart` | Private | Add item to cart (validated against stock) |
| `PUT` | `/api/cart/:productId` | Private | Update item quantity |
| `DELETE` | `/api/cart/:productId` | Private | Remove item from cart |
| `DELETE` | `/api/cart` | Private | Clear user's cart |
| `POST` | `/api/cart/sync` | Private | Sync guest cart upon login |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Private | Place new order & decrement stock |
| `GET` | `/api/orders/my-orders` | Private | Get logged-in user's order history |
| `GET` | `/api/orders/:id` | Private | Get single order details |
| `PUT` | `/api/orders/:id/cancel` | Private | Cancel order (restores stock) |

### Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/:productId` | Public | Get reviews & rating distribution for a product |
| `POST` | `/api/reviews` | Private | Submit a product review (1 per user per product) |
| `PUT` | `/api/reviews/:id` | Private | Edit review |
| `DELETE` | `/api/reviews/:id` | Private | Delete review |

### Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Get revenue, order counts, charts & category stats |
| `GET` | `/api/admin/orders` | Admin | Get paginated list of all customer orders |
| `PUT` | `/api/admin/orders/:id/status`| Admin | Advance order status (`Confirmed` → `Delivered`) |
| `GET` | `/api/admin/users` | Admin | Get user directory |
| `PUT` | `/api/admin/users/:id/role` | Admin | Change user role (`user` ↔ `admin`) |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete user account |

---

## CodeAlpha Requirement Compliance Checklist

- [x] **User Authentication**: Register, Login, JWT auth, bcrypt password hashing, persistent sessions, update profile, change password.
- [x] **Home Page**: Modern hero section, search, category cards, featured items, best sellers, promotional banner, values footer.
- [x] **Product Listing**: Category filtering, price range filter, minimum rating filter, in-stock toggle, sorting, pagination, search.
- [x] **Product Details**: Image gallery, stock indicator, quantity limiter, add to cart, buy now, specifications table, reviews.
- [x] **Shopping Cart**: Real-time quantity updates, stock bounds checking, tax & shipping calculation, free shipping progress bar, promo coupons.
- [x] **Checkout**: Complete shipping address collection, Cash on Delivery & Demo card options, price summary, place order.
- [x] **Order Processing**: Stock decrementing on order placement, order status history, visual order tracker, cancellation with stock restore.
- [x] **User Dashboard**: Profile summary, order history cards, status pills, address settings, security/password update.
- [x] **Admin Dashboard**: Revenue/sales metrics, SVG sales trend charts, product inventory CRUD, order status manager, user role manager.
- [x] **Database & Models**: MongoDB Mongoose schemas for User, Product, Order, Review, Cart with compound indexes and validation.
- [x] **Security**: JWT Bearer verification, admin role guard middleware, error sanitization, `.env.example`.
- [x] **Seed Data**: 20+ realistic sample products across 5 categories with high-res Unsplash imagery, pre-seeded reviews & sample orders.

---

## License & Internship Credits

Developed with dedication for the **CodeAlpha Full Stack Development Internship**.
Licensed under the [MIT License](LICENSE).
