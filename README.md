# 🚀 CodeAlpha Full Stack Development Internship — Master Repository

<p align="center">
  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80" alt="CodeAlpha Full Stack Internship Banner" width="100%" style="border-radius: 14px;" />
</p>

<p align="center">
  <strong>Complete Monorepo Containing All 4 CodeAlpha Full Stack Internship Projects</strong><br>
  <em>Production-Grade Architecture • Real-Time WebSockets • WebRTC • Zero-Config Embedded Database</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue.svg?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Node.js-20.x-green.svg?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Express-4.21-000000.svg?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%208.x-brightgreen.svg?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-4.8-010101.svg?logo=socket.io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/WebRTC-Mesh-red.svg?logo=webrtc" alt="WebRTC" />
  <img src="https://img.shields.io/badge/License-MIT-purple.svg" alt="License" />
</p>

---

## 📑 Table of Contents
1. [Overview & Internship Scope](#-overview--internship-scope)
2. [Monorepo Architecture](#-monorepo-architecture)
3. [The 4 Full-Stack Projects](#-the-4-full-stack-projects)
   - [Task 1: ShopSphere — E-Commerce Store](#1-task-1-shopsphere--full-stack-e-commerce-store)
   - [Task 2: Pulse — Social Media Platform](#2-task-2-pulse--social-media--micro-blogging-platform)
   - [Task 3: FlowBoard — Project Management Tool](#3-task-3-flowboard--project-management--kanban-workspace)
   - [Task 4: Nexus — Real-Time Communication](#4-task-4-nexus--real-time-webrtc-video-calling--whiteboard)
4. [Port Mapping & Multi-App Runtime](#-port-mapping--multi-app-runtime)
5. [Evaluator Demo Credentials](#-evaluator-demo-credentials)
6. [Quick Start & Setup Instructions](#-quick-start--setup-instructions)
7. [Zero-Config In-Memory Database Fallback](#-zero-config-in-memory-database-fallback)
8. [License](#-license)

---

## 📌 Overview & Internship Scope

This repository constitutes the complete submission for the **CodeAlpha Full Stack Development Internship**. 

Rather than basic CRUD exercises, all four projects have been engineered to **commercial SaaS standards**, featuring:
- **Zero Mock Endpoints**: 100% authentic REST APIs backed by MongoDB schemas and real-time WebSockets.
- **Modern UI/UX**: Polished dark-mode aesthetics, responsive layouts, optimistic updates, micro-animations, and rich state management.
- **Real-Time Synergy**: Low-latency Socket.io synchronization for live notifications, Kanban board dragging, and in-meeting whiteboard collaboration.
- **WebRTC Mesh**: Direct peer-to-peer browser video/audio streaming and native screen sharing.
- **Zero-Friction Evaluation**: Automatic embedded MongoDB fallback if a local database daemon is not running, plus one-click demo login buttons across all sign-in pages.

---

## 📂 Monorepo Architecture

```
codealpha_tasks/
├── task-1-ecommerce/                 # Task 1: ShopSphere (E-Commerce Platform)
│   ├── backend/                      # Node.js, Express, Mongoose, JWT (Port 5000)
│   ├── frontend/                     # React 18, Vite, Tailwind CSS (Port 5173)
│   ├── package.json
│   └── README.md
│
├── task-2-social-media/              # Task 2: Pulse (Social Media Platform)
│   ├── backend/                      # Express, Mongoose, Socket.io (Port 5001)
│   ├── frontend/                     # React 18, Vite, Tailwind CSS (Port 5174)
│   ├── package.json
│   └── README.md
│
├── task-3-project-management/        # Task 3: FlowBoard (Kanban Project Management)
│   ├── backend/                      # Express, Mongoose, Socket.io (Port 5002)
│   ├── frontend/                     # React 18, Vite, Tailwind CSS (Port 5175)
│   ├── package.json
│   └── README.md
│
├── task-4-real-time-communication/   # Task 4: Nexus (WebRTC Video Calling & Whiteboard)
│   ├── backend/                      # Express, WebRTC Signaling, Sockets (Port 5003)
│   ├── frontend/                     # React 18, Vite, Canvas, WebRTC (Port 5176)
│   ├── package.json
│   └── README.md
│
├── package.json                      # Monorepo Master Scripts
├── LICENSE                           # MIT License
├── .gitignore
└── README.md                         # Master Documentation
```

---

## 🎯 The 4 Full-Stack Projects

### 1. Task 1: ShopSphere — Full-Stack E-Commerce Store
> *"Discover better. Shop smarter."*

- **Catalog & Discovery**: Instant debounced search, category filters (`Audio`, `Wearables`, `Photography`, `Laptops`, `Accessories`), rating filtering, price range slider, and multi-sort.
- **Product Details & Gallery**: Dynamic high-res image zoom, stock indicator, related recommendations, and verified customer reviews.
- **Cart & Dynamic Pricing**: Live quantity stepper, subtotal calculation, free shipping progress bar, and promo code support (`SAVE10` for 10% off).
- **3-Step Checkout Flow**: Shipping address, payment method selection (Credit Card, PayPal, Cash on Delivery), and order summary verification.
- **Interactive Order Tracking**: Visual order timeline tracker with status progression (`Pending` -> `Processing` -> `Shipped` -> `Delivered`).
- **Role-Based Admin Portal**: Real-time sales analytics, inventory stock decrementing on checkout, product CRUD, and order status lifecycle manager.

---

### 2. Task 2: Pulse — Social Media & Micro-Blogging Platform
> *"Share your world. Find your people."*

- **Dual-Stream Timelines**: Toggle between algorithmic **"For You"** feed and chronological **"Following"** feed.
- **Rich Post Creation**: Text formatting, image URL attachments with aspect ratio preservation, and auto-linked hashtag parsing (`#react`, `#ai`, `#webdev`).
- **Optimistic Interactions**: Instant like toggling with heart animations, bookmarked posts vault, and threaded expandable comments.
- **Profile Customization**: Dynamic avatars, cover banners, bios, location, website links, and user post/media/like galleries.
- **Real-Time Notifications**: Instant alert toasts and badge increments over Socket.io when someone likes or comments on your post.
- **Discovery Hub**: Trending topics sidebar, live creator search, and "Who to Follow" recommendation widgets.

---

### 3. Task 3: FlowBoard — Project Management & Kanban Workspace
> *"Plan. Collaborate. Ship."*

- **HTML5 Drag-and-Drop Board**: Seamless task card dragging between sprint columns (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`).
- **Live Multi-Client Synchronization**: Card movements and status updates synchronize instantly across all active browser windows via Socket.io.
- **Comprehensive Task Modal**: Subtasks checklist with completion percentage bar, priority badges (`Low`, `Medium`, `High`, `Urgent`), assignees, custom tags, and task comment feeds.
- **Project Portfolios**: Create and manage multiple projects with custom key prefixes (e.g. `AETH`, `HYPE`), sprint progress meters, and deadlines.
- **Productivity Analytics**: Visual breakdown of task statuses, completion velocity rate, overdue work alerts, and priority distribution.

---

### 4. Task 4: Nexus — Real-Time WebRTC Video Calling & Whiteboard
> *"Meet. Collaborate. Create."*

- **Low-Latency WebRTC Mesh Calling**: Crystal clear audio and video peer-to-peer conferencing with adaptive participant grid layouts.
- **Media Controls**: Microphone mute/unmute, Camera toggle on/off, and Native Screen Sharing (`getDisplayMedia`).
- **Collaborative Real-Time Whiteboard**: Synchronized HTML5 Canvas vector drawing engine with Pen, Eraser, Line, Rectangle, Circle, custom colors, brush thickness, and high-res PNG snapshot export.
- **In-Meeting Live Chat**: Real-time messaging stream with sender timestamps, participant badges, and unread notification counter.
- **Lobby Device Testing**: Pre-meeting hardware verification for camera and microphone streams before joining conference rooms.

---

## 🌐 Port Mapping & Multi-App Runtime

All 4 projects run on isolated, dedicated port pairs so that they can be launched concurrently without collisions:

| Task # | Project Name | Frontend URL | Backend API URL | Socket Gateway |
|---|---|---|---|---|
| **Task 1** | **ShopSphere** (E-Commerce) | `http://localhost:5173` | `http://localhost:5000` | N/A |
| **Task 2** | **Pulse** (Social Media) | `http://localhost:5174` | `http://localhost:5001` | `ws://localhost:5001` |
| **Task 3** | **FlowBoard** (Kanban) | `http://localhost:5175` | `http://localhost:5002` | `ws://localhost:5002` |
| **Task 4** | **Nexus** (Video & Canvas) | `http://localhost:5176` | `http://localhost:5003` | `ws://localhost:5003` |

---

## 🔑 Evaluator Demo Credentials

Every application includes **One-Click Demo Sign-In** buttons directly on the login screens for effortless evaluation. Alternatively, you can use these verified credentials:

### Task 1: ShopSphere
- **Admin User**: `admin@shopsphere.com` / `password123` *(Full access to analytics and inventory management)*
- **Regular Customer**: `john@example.com` / `password123`

### Task 2: Pulse
- **Alex Rivera (Lead)**: `alex@pulse.dev` / `password123`
- **Sarah Chen (AI Researcher)**: `sarah@pulse.dev` / `password123`

### Task 3: FlowBoard
- **Elena Rostova (PM)**: `elena@flowboard.dev` / `password123`
- **Alex Rivera (Tech Lead)**: `alex@flowboard.dev` / `password123`

### Task 4: Nexus
- **Marcus Vance (Host)**: `marcus@nexus.dev` / `password123`
- **Sarah Chen (Participant)**: `sarah@nexus.dev` / `password123`

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) (v9.x or v10.x)
- MongoDB *(Optional — In-memory Mongo automatically activates if not running)*

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/codealpha_tasks.git
cd codealpha_tasks
```

### Step 2: Install All Dependencies
Install dependencies across all 4 tasks with a single command from the repository root:
```bash
npm run install:all
```

### Step 3: Seed Sample Databases
Populate all four projects with realistic demo products, social posts, Kanban tasks, and meeting rooms:
```bash
npm run seed:all
```

---

### Step 4: Running Any Individual Task

#### Run Task 1 (ShopSphere — E-Commerce):
```bash
# Terminal 1: Backend
cd task-1-ecommerce/backend && npm run dev

# Terminal 2: Frontend
cd task-1-ecommerce/frontend && npm run dev
# -> Opens http://localhost:5173
```

#### Run Task 2 (Pulse — Social Media):
```bash
# Terminal 1: Backend
cd task-2-social-media/backend && npm run dev

# Terminal 2: Frontend
cd task-2-social-media/frontend && npm run dev
# -> Opens http://localhost:5174
```

#### Run Task 3 (FlowBoard — Project Management):
```bash
# Terminal 1: Backend
cd task-3-project-management/backend && npm run dev

# Terminal 2: Frontend
cd task-3-project-management/frontend && npm run dev
# -> Opens http://localhost:5175
```

#### Run Task 4 (Nexus — Real-Time Communication):
```bash
# Terminal 1: Backend
cd task-4-real-time-communication/backend && npm run dev

# Terminal 2: Frontend
cd task-4-real-time-communication/frontend && npm run dev
# -> Opens http://localhost:5176
```

---

## 🛡️ Zero-Config In-Memory Database Fallback

To ensure evaluators can test the applications instantly on any operating system without installing or starting MongoDB locally, every backend includes an intelligent fallback mechanism:

```javascript
try {
  // 1. Attempt connection to local or cloud MongoDB instance
  await mongoose.connect(process.env.MONGO_URI);
} catch (err) {
  // 2. Automatically spawn an embedded in-memory MongoDB server
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  console.log('[DB] In-Memory Mongo fallback initialized seamlessly.');
}
```

---

## 📄 License
This repository and all associated projects are open-source and released under the [MIT License](LICENSE).