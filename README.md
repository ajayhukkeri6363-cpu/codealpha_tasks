# 🚀 CodeAlpha Full Stack Projects

> A collection of four production-style full-stack applications built for the **CodeAlpha Full Stack Development Internship**.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Native-333333?style=for-the-badge&logo=webrtc&logoColor=white)](https://webrtc.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📑 Table of Contents
1. [Project Showcase](#-project-showcase)
   * [1. ShopSphere — Premium E-Commerce Platform](#-shopsphere)
   * [2. Pulse — Social Media Platform](#-pulse)
   * [3. FlowBoard — Project Management Platform](#-flowboard)
   * [4. Nexus — Real-Time Communication Platform](#-nexus)
2. [Project Comparison Table](#-project-comparison-table)
3. [Architecture](#-architecture)
4. [Quick Start](#-quick-start)
5. [Demo Accounts](#-demo-accounts)
6. [Screenshots](#-screenshots)
7. [Technology Stack](#-technology-stack)
8. [CodeAlpha Requirements](#-codealpha-requirements)
9. [Production Deployment Guide](DEPLOYMENT.md)
10. [Repository Structure](#-repository-structure)
11. [License](#-license)

---

## 🌟 Project Showcase

### 🛒 ShopSphere
**Premium E-Commerce Platform** &bull; `task-1-ecommerce/` &bull; **Status**: 🟢 Completed

A complete full-stack shopping platform with authentication, products, cart, checkout, orders, reviews, wishlist, and administration.

* **Authentication**: JWT authentication with bcrypt password hashing and role-based access control (Admin & Customer).
* **Product Catalog**: 20 rich pre-seeded items across 5 categories with pagination, instant keyword search, category filters, and price sliders.
* **Search and Filtering**: Instant client & server-side search, brand selection, rating threshold filter, and in-stock toggles.
* **Shopping Cart**: Interactive slide-over cart, quantity modification, and dynamic discount code engine (`SAVE10` for 10% off).
* **Checkout**: 3-step checkout flow (Shipping address, payment selection, and order summary).
* **Orders**: Inventory stock auto-decrementing, customer order history, and lifecycle status tracking (`Confirmed` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered`).
* **Reviews**: Customer star ratings (1–5) and feedback submission with dynamic score calculation.
* **Wishlist**: One-click product bookmarking with persistent storage.
* **Admin Dashboard**: Real-time sales metrics, revenue analytics, low-stock inventory alerts, and order fulfillment controls.
* **Analytics**: Revenue summation, order status breakdown, and customer growth trends.

---

### 📱 Pulse
**Social Media Platform** &bull; `task-2-social-media/` &bull; **Status**: 🟢 Completed

A high-performance modern social media and community platform with dual feeds, instant micro-interactions, responsive mobile navigation, and live notifications.

* **Profiles**: User profiles with custom avatars, cover photos, bio, location, external website links, and follower counts.
* **Posts**: Rich post creation with text, hashtag parsing (`#design`, `#webdev`), and aspect-ratio image uploads with lightbox preview.
* **Likes**: Optimistic heart like animations with real-time like count increments.
* **Comments**: Expandable comment threads with timestamps and user attribution.
* **Follow System**: Bi-directional follow/unfollow graph with follower and following counters.
* **Notifications**: Live Socket.io push notifications for likes, comments, and new followers.
* **Explore**: Discovery hub with search, trending topics sidebar, and "Who to follow" recommendation widgets.
* **Search**: Real-time post search by hashtag or keyword.
* **Saved Posts**: Private bookmarking vault to save and revisit favorite content.

---

### 📊 FlowBoard
**Project Management Platform** &bull; `task-3-project-management/` &bull; **Status**: 🟢 Completed

An enterprise-ready agile project management workspace with real-time drag-and-drop Kanban sprint boards, checklist progress meters, and velocity analytics.

* **Projects**: Multi-project workspace management with unique project keys (`AETH`, `HYPE`), owner roles, and deadline trackers.
* **Kanban Boards**: 5 workflow columns (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`) for visual task management.
* **Drag and Drop**: Fluid HTML5 drag-and-drop card movements with persistent order re-indexing.
* **Task Assignment**: Assign tasks to multiple team members with initials and colored avatar badges.
* **Priorities**: Visual priority indicators (`Low`, `Medium`, `High`, `Urgent`) and story point allocations (Fibonacci scale).
* **Labels**: Color-coded category tags (`Design System`, `Frontend`, `DevOps`, `Accessibility`).
* **Due Dates**: Visual due date countdowns with overdue warning indicators.
* **Comments**: In-task discussion threads for team collaboration.
* **Activity**: Audit trail logging creation, status transitions, and member edits.
* **Notifications**: Real-time Socket.io board synchronization updating remote peers when tasks are moved.
* **Analytics**: Sprint progress meters, completion rate metrics, and task status distributions.

---

### 🎥 Nexus
**Real-Time Communication Platform** &bull; `task-4-real-time-communication/` &bull; **Status**: 🟢 Completed

A modern WebRTC peer-to-peer audio/video conferencing platform with synchronized collaborative vector whiteboard, in-meeting chat, and hardware pre-flight testing.

* **Authentication**: JWT user login and registration with quick demo sign-in buttons.
* **Meeting Rooms**: Instant meeting room generation with human-readable room IDs (`design-sprint`, `eng-sync`).
* **Video/Audio**: Low-latency multi-peer WebRTC audio/video mesh conferencing with responsive grid layouts.
* **Screen Sharing**: One-click screen sharing using browser `getDisplayMedia` API.
* **Chat**: Persistent in-meeting chat stream with sender tags, avatars, and timestamps.
* **Participants**: Active participant roster drawer with mic and camera status indicators.
* **Whiteboard**: Real-time collaborative HTML5 canvas with Pen, Eraser, Line, Rectangle, Circle, custom stroke width, color palette, and PNG export.
* **File Sharing**: File sharing attachment metadata in chat history.
* **WebRTC**: Native browser `RTCPeerConnection` mesh calling.
* **Socket.io**: Real-time SDP offer/answer exchange, ICE candidate signaling, and whiteboard delta broadcasts.

---

## 📊 Project Comparison Table

| Project | Domain | Frontend | Backend | Database | Real-Time | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **ShopSphere** | E-Commerce | React 18, Vite, Tailwind CSS | Node.js, Express REST API | MongoDB, Mongoose | REST Polling | 🟢 Completed |
| **Pulse** | Social Media | React 18, Vite, Tailwind CSS | Node.js, Express REST API | MongoDB, Mongoose | Socket.io Notifications | 🟢 Completed |
| **FlowBoard** | Project Management | React 18, Vite, Tailwind CSS | Node.js, Express REST API | MongoDB, Mongoose | Socket.io Kanban Sync | 🟢 Completed |
| **Nexus** | Real-Time Video & Canvas | React 18, Vite, Tailwind CSS | Node.js, Express REST API | MongoDB, Mongoose | WebRTC Mesh + Socket.io | 🟢 Completed |

---

## 🏗 Architecture

### Standard REST & WebSocket Architecture (Tasks 1, 2, 3)

```
React Frontend (Vite)
       ↓
REST API / Socket.io
       ↓
Express Backend (Node.js)
       ↓
MongoDB (Embedded In-Memory Fallback / External Mongo)
```

### Real-Time WebRTC Mesh Architecture (Task 4 — Nexus)

```
React Frontend
       ↓
Socket.io Signaling Server (Express)
       ↓
WebRTC Peer-to-Peer Media (SRTP / DTLS)
       ↓
Direct Client-to-Client Video, Audio & Screen Streams
```

---

## ⚡ Quick Start

### Prerequisites
* **Node.js**: `v18.x` or `v20.x`
* **npm**: `v9.x` or `v10.x`
* **MongoDB**: *Optional* — Every backend includes an automated embedded In-Memory MongoDB (`mongodb-memory-server`) fallback that starts automatically if no local MongoDB instance is detected.

---

### 🛒 Task 1: ShopSphere (E-Commerce)

**Backend Setup (Port 5000):**
```bash
cd task-1-ecommerce/backend
npm install
npm start
```
*Environment Variables (optional in `backend/.env`)*:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shopsphere
JWT_SECRET=your_jwt_secret_key_here
```

**Frontend Setup (Port 5173):**
```bash
cd task-1-ecommerce/frontend
npm install
npm run dev
```

---

### 📱 Task 2: Pulse (Social Media)

**Backend Setup (Port 5001):**
```bash
cd task-2-social-media/backend
npm install
npm start
```
*Environment Variables (optional in `backend/.env`)*:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/pulse_social
JWT_SECRET=your_jwt_secret_key_here
```

**Frontend Setup (Port 5174):**
```bash
cd task-2-social-media/frontend
npm install
npm run dev
```

---

### 📊 Task 3: FlowBoard (Project Management)

**Backend Setup (Port 5002):**
```bash
cd task-3-project-management/backend
npm install
npm start
```
*Environment Variables (optional in `backend/.env`)*:
```env
PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/flowboard_db
JWT_SECRET=your_jwt_secret_key_here
```

**Frontend Setup (Port 5175):**
```bash
cd task-3-project-management/frontend
npm install
npm run dev
```

---

### 🎥 Task 4: Nexus (Real-Time Communication)

**Backend Setup (Port 5003):**
```bash
cd task-4-real-time-communication/backend
npm install
npm start
```
*Environment Variables (optional in `backend/.env`)*:
```env
PORT=5003
MONGO_URI=mongodb://127.0.0.1:27017/nexus_db
JWT_SECRET=your_jwt_secret_key_here
```

**Frontend Setup (Port 5176):**
```bash
cd task-4-real-time-communication/frontend
npm install
npm run dev
```

---

## 🎮 Demo Accounts

> [!NOTE]
> These credentials are demo accounts created specifically for local/project evaluation. When starting with an empty database, each backend auto-seeds these accounts with rich sample data.

| Project | Role | Email | Password | Evaluation Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **ShopSphere** | Administrator | `admin@shopsphere.com` | `admin123` | Access to admin sales analytics, inventory management, and order status updates |
| **ShopSphere** | Customer | `user@shopsphere.com` | `user123` | Pre-loaded past orders, cart items, and wishlist |
| **Pulse** | Lead Designer | `elena@pulse.com` | `password123` | Seeded with 5 posts, followers, comments & notifications |
| **Pulse** | Systems Eng | `leo@pulse.com` | `password123` | Seeded follower with WebRTC posts |
| **FlowBoard** | Product Manager | `elena@flowboard.dev` | `password123` | Owner of "Aether UI Design System" project with 6 tasks |
| **FlowBoard** | Tech Lead | `alex@flowboard.dev` | `password123` | Owner of "HyperScale AI Microservices" project |
| **Nexus** | Host User | `marcus@nexus.dev` | `password123` | Host of pre-configured room `design-sprint` |
| **Nexus** | Engineer | `alex@nexus.dev` | `password123` | Host of pre-configured room `eng-sync` |

---

## 📸 Screenshots

### ShopSphere
| View | Preview / Description |
| :--- | :--- |
| **Homepage** | *Hero banner, category carousels, featured product showcase grid* |
| **Product Listing** | *Multi-facet search, price sliders, brand filters, and star rating sorting* |
| **Product Details** | *High-res photo gallery, stock indicator, specifications table, and reviews* |
| **Cart** | *Slide-over interactive cart, quantity modifiers, and promo coupon applicator* |
| **Checkout** | *3-step checkout flow (Shipping address, payment selection, order review)* |
| **Admin Dashboard** | *Real-time sales metrics, revenue analytics, inventory management, order controls* |

### Pulse
| View | Preview / Description |
| :--- | :--- |
| **Feed** | *Dual timeline tabs ("For You" and "Following") with micro-interactions* |
| **Profile** | *Custom cover photo, user avatar, bio, location, follower/following stats, and post grid* |
| **Explore** | *Search discovery, trending topics sidebar, and "Who to Follow" recommendations* |
| **Notifications** | *Live Socket.io notification drawer for likes, comments, and new followers* |

### FlowBoard
| View | Preview / Description |
| :--- | :--- |
| **Dashboard** | *Workspace hub with project cards, deadline indicators, and progress meters* |
| **Kanban Board** | *5-column drag-and-drop board with real-time Socket.io client synchronization* |
| **Task Details** | *Interactive subtask checklist with completion % bar, story points, and comments* |
| **Analytics** | *Project velocity charts, status breakdown, and team workload distribution* |

### Nexus
| View | Preview / Description |
| :--- | :--- |
| **Meeting Lobby** | *Hardware pre-flight check with live audio activity visualizer and camera preview* |
| **Video Room** | *Multi-peer WebRTC mesh video grid with camera/mic controls and screen sharing* |
| **Chat** | *In-meeting persistent chat stream with sender tags and active participant roster* |
| **Whiteboard** | *Synchronized HTML5 canvas (Pen, Eraser, Line, Rect, Circle, Colors, PNG Export)* |

---

## 🧰 Technology Stack

### Frontend
* **React 18** — Component-driven UI architecture
* **Vite 5** — Fast build tooling and HMR
* **JavaScript (ES6+)** — Modern language features
* **CSS3 & Tailwind CSS** — Responsive styling and design tokens
* **React Router DOM v6** — Declarative client-side routing
* **Lucide React** — Consistent modern iconography

### Backend
* **Node.js (v20.x)** — Scalable asynchronous JavaScript runtime
* **Express.js (v4.x)** — Robust REST API routing and middleware framework
* **REST APIs** — Standardized JSON endpoints with HTTP status codes
* **Socket.io (v4.x)** — Bi-directional event-based real-time communication

### Database
* **MongoDB (v7.0)** — Document-oriented NoSQL database
* **Mongoose (v8.x)** — Schema validation and object data modeling
* **MongoDB Memory Server (v10.x)** — Zero-config in-memory database fallback

### Real-Time
* **Socket.io** — WebSockets for board synchronization, signaling, and notifications
* **WebRTC** — Native browser `RTCPeerConnection` for direct audio, video, and screen sharing

### Authentication
* **JWT (JSON Web Tokens)** — Stateless token-based session management
* **bcryptjs** — Cryptographic password hashing (salt rounds: 10)

---

## ✅ CodeAlpha Requirements

### Task 1: Simple E-Commerce Store (ShopSphere)
- [x] Product listings with search, category filtering & pricing sort
- [x] Shopping cart with quantity adjustment & dynamic total computation
- [x] Detailed product view with specifications & customer reviews
- [x] Order processing with inventory decrementing & status lifecycle
- [x] User registration/login with JWT & password hashing
- [x] Database schemas for Users, Products, Orders, Cart, and Reviews

### Task 2: Social Media Platform (Pulse)
- [x] User profiles with customizable avatars, cover photos, bio & links
- [x] Post creation with hashtags and media image attachments
- [x] Interactive comments system with threaded replies
- [x] Like/follow system with real-time counters
- [x] Real-time notifications via Socket.io
- [x] Database schemas for Users, Posts, Comments, Notifications, and SavedPosts

### Task 3: Project Management Tool (FlowBoard)
- [x] Group projects with unique keys and member role assignments
- [x] Assign tasks with priorities, story points, and due dates
- [x] Comments/communication thread within each task card
- [x] Authentication with role-based access
- [x] Project boards with 5-column Kanban layout
- [x] Task cards with checklist subtasks and progress meter
- [x] Backend/database integration with live Socket.io sync

### Task 4: Real-Time Communication App (Nexus)
- [x] Video calling with native WebRTC multi-peer mesh
- [x] Screen sharing capability via browser media streams
- [x] File sharing indicators within meeting room chat
- [x] Synchronized HTML5 vector whiteboard with drawing tools & PNG export
- [x] Authentication & room authorization
- [x] Real-time communication via WebRTC and Socket.io signaling
- [~] *Note on Scale*: Uses WebRTC full-mesh topology, recommended for 2–6 active video participants per room.

---

## 📁 Repository Structure

```
codealpha_tasks/
│
├── task-1-ecommerce/                 # ShopSphere — E-Commerce Platform
│   ├── frontend/                     # React 18 / Vite Client (Port 5173)
│   ├── backend/                      # Express REST API (Port 5000)
│   └── README.md                     # Task 1 Documentation
│
├── task-2-social-media/              # Pulse — Social Media Platform
│   ├── frontend/                     # React 18 / Vite Client (Port 5174)
│   ├── backend/                      # Express REST API + Socket.io (Port 5001)
│   └── README.md                     # Task 2 Documentation
│
├── task-3-project-management/        # FlowBoard — Project Management Tool
│   ├── frontend/                     # React 18 / Vite Client (Port 5175)
│   ├── backend/                      # Express REST API + Socket.io (Port 5002)
│   └── README.md                     # Task 3 Documentation
│
├── task-4-real-time-communication/   # Nexus — Real-Time Video & Whiteboard
│   ├── frontend/                     # React 18 / Vite Client (Port 5176)
│   ├── backend/                      # Express REST API + Socket.io Mesh (Port 5003)
│   └── README.md                     # Task 4 Documentation
│
├── README.md                         # Master Monorepo Documentation
├── LICENSE                           # MIT License
└── .gitignore                        # Global Git Ignore
```

---

## 🚀 Deployment Readiness

| Application | Runtime Status | Frontend Deployment | Backend Deployment | Database Requirement |
| :--- | :---: | :--- | :--- | :--- |
| **ShopSphere** | `PRODUCTION READY` | Static build (`dist/`) deployable to Vercel / Netlify | Node runtime deployable to Render / Railway / AWS ECS | Embedded Mongo (Local) / MongoDB Atlas (Cloud) |
| **Pulse** | `PRODUCTION READY` | Static build (`dist/`) deployable to Vercel / Netlify | Node + WebSockets deployable to Render / Railway / AWS | Embedded Mongo (Local) / MongoDB Atlas (Cloud) |
| **FlowBoard** | `PRODUCTION READY` | Static build (`dist/`) deployable to Vercel / Netlify | Node + WebSockets deployable to Render / Railway / AWS | Embedded Mongo (Local) / MongoDB Atlas (Cloud) |
| **Nexus** | `PRODUCTION READY` | Static build (`dist/`) deployable to Vercel / Netlify | Node + WebSockets deployable to Render / Railway / AWS | Embedded Mongo (Local) / MongoDB Atlas (Cloud) |

* **Local Evaluation**: Zero setup required. Backends automatically spawn an embedded in-memory MongoDB instance if local MongoDB is not running.
* **Cloud Production Deployment**: Simply supply a `MONGODB_URI` connection string pointing to MongoDB Atlas or an external database cluster.

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE). Built for the **CodeAlpha Full Stack Development Internship**.