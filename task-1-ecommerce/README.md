# TASK 1: SHOPSPHERE — E-Commerce Platform
> *"Discover better. Shop smarter."*

ShopSphere is a full-stack e-commerce web application featuring modern product exploration, catalog filtering, inventory management, user cart & checkout, order processing, and administrative controls.

## Tech Stack
* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM
* **Backend**: Node.js, Express.js, REST APIs, JWT, BcryptJS
* **Database**: MongoDB & Mongoose (with automated Embedded MongoDB Memory Server fallback)

## Core Features
* User Authentication & Profile (JWT, bcrypt password hashing, address manager, password update)
* Responsive Homepage with hero, category showcase, featured items, and best sellers
* Product Catalog with search, multi-facet filtering (category, price range, ratings, in-stock), and sorting
* Product Details with multi-image gallery, stock indicator, specifications, and customer reviews
* Cart with real-time stock bounds checking, tax & shipping calculation, free shipping progress meter, and promo coupons (`SAVE10`)
* Checkout with shipping address collection, Cash on Delivery / Demo Online Payment, and instant stock deduction
* Real-time Order Tracking (`Confirmed` → `Processing` → `Shipped` → `Delivered`)
* Admin Dashboard with revenue analytics, sales trajectory charts, product inventory CRUD, and order status manager

## Demo Accounts
* **Admin**: `admin@shopsphere.com` / `admin123`
* **Customer**: `user@shopsphere.com` / `user123`

## Quick Start
```bash
# In task-1-ecommerce/
npm install --prefix backend
npm install --prefix frontend
npm run dev
```
* **Frontend**: http://localhost:5173
* **Backend API**: http://localhost:5000
