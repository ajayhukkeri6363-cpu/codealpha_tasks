# CodeAlpha Full Stack Projects

<p align="center">
  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80" alt="CodeAlpha Master Monorepo Banner" width="100%" style="border-radius: 14px;" />
</p>

<p align="center">
  <strong>Top-Tier Engineering Portfolio — CodeAlpha Full Stack Development Internship</strong><br>
  <em>Production Monorepo Containing All 4 Full-Stack Internship Tasks</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue.svg?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Node.js-20.x-green.svg?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Express-4.21-000000.svg?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%208.x-brightgreen.svg?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-4.8-010101.svg?logo=socket.io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/WebRTC-P2P%20Mesh-red.svg?logo=webrtc" alt="WebRTC" />
  <img src="https://img.shields.io/badge/License-MIT-purple.svg" alt="License" />
</p>

---

## 📑 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [The 4 Full-Stack Projects](#-the-4-full-stack-projects)
   - [01 — ShopSphere (E-Commerce Platform)](#01--shopsphere--full-stack-e-commerce-platform)
   - [02 — Pulse (Social Media Platform)](#02--pulse--social-media--micro-blogging-platform)
   - [03 — FlowBoard (Project Management Platform)](#03--flowboard--project-management--kanban-workspace)
   - [04 — Nexus (Real-Time Communication Platform)](#04--nexus--real-time-webrtc-video-conferencing--whiteboard)
3. [Project Comparison Matrix](#-project-comparison-matrix)
4. [Monorepo Architecture](#-monorepo-architecture)
5. [Port Configuration & Multi-App Runtime](#-port-configuration--multi-app-runtime)
6. [Evaluator Demo Credentials](#-evaluator-demo-credentials)
7. [Zero-Config Database Fallback](#-zero-config-database-fallback)
8. [CodeAlpha Requirements Checklist](#-codealpha-requirements-checklist)
9. [Quick Start & Setup Instructions](#-quick-start--setup-instructions)
10. [License](#-license)

---

## 🌟 Executive Summary

This monorepo constitutes the complete submission for the **CodeAlpha Full Stack Development Internship**. 

Every project in this repository has been engineered to **commercial startup standards**, eliminating basic CRUD patterns and fake buttons in favor of:
- **100% Real Full-Stack Implementation**: Real Node.js/Express REST APIs, Mongoose data schemas, and WebSocket gateways.
- **Sub-Second Real-Time Interactivity**: Socket.io real-time notifications, live Kanban drag synchronization, and WebRTC peer video calling.
- **Zero-Friction Evaluation**: Embedded In-Memory MongoDB (`mongodb-memory-server`) fallback that triggers automatically if local MongoDB is inactive, plus **One-Click Demo Login** buttons on every authentication screen.
- **Responsive & Accessible**: Optimized for mobile devices (375px - 414px), tablets (768px - 1024px), and desktop monitors (1440px - 1920px).

---

## 🚀 The 4 Full-Stack Projects

### 01 — ShopSphere
#### *Full-Stack E-Commerce Platform*
> *"Discover better. Shop smarter."*

- **Description**: A modern e-commerce web application featuring high-res product galleries, multi-facet filtering, dynamic cart calculation with promo code discounts, 3-step checkout, visual order tracking timeline, and an administrative control panel with inventory management.
- **Main Features**:
  - Multi-facet catalog search with debouncing, category tabs, rating filters, and price range sliders.
  - Interactive product details with zoom preview, verified customer ratings, and review submission.
  - Cart with free shipping meter, dynamic coupon engine (`SAVE10` for 10% off), and quantity steppers.
  - 3-step checkout flow (Shipping address, Payment method, and Order Summary).
  - Visual order timeline progression tracker (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
  - Role-based Admin Dashboard for revenue metrics, stock auto-decrementing, product CRUD, and order status updates.
- **Tech Stack**: React 18, Vite, Tailwind CSS, Lucide Icons, Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js.
- **Ports**: Frontend `http://localhost:5173` | Backend API `http://localhost:5000`
- **Demo Credentials**:
  - Admin: `admin@shopsphere.com` / `password123`
  - Customer: `john@example.com` / `password123`
- **Future Enhancements**: Stripe webhook integration, multi-currency localization.

---

### 02 — Pulse
#### *Social Media & Micro-Blogging Platform*
> *"Share your world. Find your people."*

- **Description**: A high-performance real-time social networking and micro-blogging platform designed for developers and creators. Includes dual feed streams, media attachments, instant like heart animations, threaded discussions, bookmarking vault, and live Socket.io alerts.
- **Main Features**:
  - Dual timeline tabs: algorithmic **"For You"** feed and chronological **"Following"** feed.
  - Post composer with image URL attachments, preview cards, and auto-linked hashtag parsing (`#webdev`, `#ai`).
  - Optimistic likes with micro-animations, bookmarked posts vault, and threaded expandable comments.
  - Real-time notification alerts over Socket.io for likes, comments, and follows without page reloads.
  - Creator profiles with custom avatars, cover banners, bios, location, tech stack chips, and activity tabs.
  - Responsive Mobile Bottom Navigation Bar (`Feed`, `Explore`, `Create (+)`, `Notifications`, `Saved`, `Profile`).
  - Discovery hub with trending topics sidebar and "Who to Follow" recommendation widgets.
- **Tech Stack**: React 18, Vite, Tailwind CSS, Lucide Icons, Node.js, Express.js, Socket.io 4, MongoDB (Mongoose), JWT.
- **Ports**: Frontend `http://localhost:5174` | Backend API `http://localhost:5001`
- **Demo Credentials**:
  - Alex Rivera (Lead): `alex@pulse.dev` / `password123`
  - Sarah Chen (AI Researcher): `sarah@pulse.dev` / `password123`
- **Future Enhancements**: Direct messaging chat rooms, video upload processing.

---

### 03 — FlowBoard
#### *Project Management & Kanban Workspace*
> *"Plan. Collaborate. Ship."*

- **Description**: An enterprise agile project management tool inspired by Linear and Notion. Features HTML5 drag-and-drop Kanban sprint columns, multi-client Socket.io board synchronization, subtask progress meters, priority indicators, and team velocity metrics.
- **Main Features**:
  - HTML5 drag-and-drop Kanban board across 5 sprint columns: `Backlog`, `To Do`, `In Progress`, `In Review`, `Done`.
  - Multi-client live board synchronization over Socket.io: moving cards in one window updates remote team members instantly.
  - Task details modal with interactive subtasks checklist and completion percentage meter.
  - Priority badges (`Low`, `Medium`, `High`, `Urgent`), assignee avatars, custom labels, and task comment threads.
  - Project portfolio switcher (e.g. `AETH`, `HYPE`) with sprint progress meters and category filters.
  - Productivity analytics dashboard with status breakdown, completion velocity rate, and overdue alerts.
- **Tech Stack**: React 18, Vite, Tailwind CSS, Lucide Icons, Node.js, Express.js, Socket.io 4, MongoDB (Mongoose), JWT.
- **Ports**: Frontend `http://localhost:5175` | Backend API `http://localhost:5002`
- **Demo Credentials**:
  - Elena Rostova (PM): `elena@flowboard.dev` / `password123`
  - Alex Rivera (Tech Lead): `alex@flowboard.dev` / `password123`
- **Future Enhancements**: Gantt chart timeline view, GitHub webhook integration.

---

### 04 — Nexus
#### *Real-Time WebRTC Video Conferencing & Whiteboard*
> *"Meet. Collaborate. Create."*

- **Description**: A WebRTC peer-to-peer audio/video conferencing platform with an integrated synchronized vector whiteboard, in-meeting chat, hardware device tester, and screen sharing.
- **Main Features**:
  - Low-latency P2P mesh audio/video conferencing with adaptive responsive participant grid.
  - Hardware controls: microphone mute/unmute, camera toggle on/off, and native screen sharing (`getDisplayMedia`).
  - Synchronized collaborative vector whiteboard powered by HTML5 Canvas (Pen, Eraser, Line, Rect, Circle, Colors, Width slider, PNG Export).
  - In-meeting live chat drawer with sender avatars, timestamps, and unread notification badge.
  - Lobby hardware setup preview with camera & mic testing before joining meeting rooms.
  - Instant meeting room creation with human-readable IDs (`design-sprint`, `eng-sync`).
- **Tech Stack**: React 18, Vite, Tailwind CSS, Lucide Icons, HTML5 Canvas, WebRTC MediaStream API, Socket.io 4, Node.js, Express.js, MongoDB (Mongoose), JWT.
- **Ports**: Frontend `http://localhost:5176` | Backend API `http://localhost:5003`
- **Demo Credentials**:
  - Marcus Vance (Host): `marcus@nexus.dev` / `password123`
  - Sarah Chen (Participant): `sarah@nexus.dev` / `password123`
- **Future Enhancements**: Selective Forwarding Unit (SFU) for 50+ participants, meeting recording.

---

## 📊 Project Comparison Matrix

| Feature | 01 — ShopSphere | 02 — Pulse | 03 — FlowBoard | 04 — Nexus |
|---|---|---|---|---|
| **Domain** | E-Commerce / Retail | Social Networking | Agile Project Mgmt | Video & Collaboration |
| **Frontend Port** | `5173` | `5174` | `5175` | `5176` |
| **Backend API Port** | `5000` | `5001` | `5002` | `5003` |
| **Real-Time Sockets** | ❌ (REST Only) | ✅ (Notifications) | ✅ (Kanban Drag Sync) | ✅ (WebRTC + Canvas) |
| **WebRTC Media** | ❌ | ❌ | ❌ | ✅ (Audio, Video, Screen) |
| **Database Models** | User, Product, Order, Review, Cart | User, Post, Comment, Notification, SavedPost | User, Project, Task, Comment, Activity | User, Meeting, ChatMessage |
| **Auth & Security** | JWT + Bcrypt + Roles | JWT + Bcrypt | JWT + Bcrypt | JWT + Bcrypt |
| **Mobile Navigation** | Responsive Menu Drawer | Bottom Tab Bar | Horizontal Swipe Board | Adaptive Video Layout |
| **Zero-Config DB** | ✅ In-Memory Fallback | ✅ In-Memory Fallback | ✅ In-Memory Fallback | ✅ In-Memory Fallback |

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
├── task-2-social-media/              # Task 2: Pulse (Social Media & Micro-blogging)
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
├── LICENSE                           # MIT Open-Source License
├── .gitignore
└── README.md                         # Master Portfolio Documentation
```

---

## 🔑 Evaluator Demo Credentials

Every application features **One-Click Demo Sign-In** buttons on the login screens for instant evaluation without manual typing. Alternatively, you can use these verified accounts:

| Task / Application | Role / Persona | Email | Password |
|---|---|---|---|
| **Task 1: ShopSphere** | Admin (Full Access) | `admin@shopsphere.com` | `password123` |
| **Task 1: ShopSphere** | Customer | `john@example.com` | `password123` |
| **Task 2: Pulse** | Lead Full Stack | `alex@pulse.dev` | `password123` |
| **Task 2: Pulse** | AI Researcher | `sarah@pulse.dev` | `password123` |
| **Task 3: FlowBoard** | Product Manager | `elena@flowboard.dev` | `password123` |
| **Task 3: FlowBoard** | Tech Lead | `alex@flowboard.dev` | `password123` |
| **Task 4: Nexus** | Meeting Host | `marcus@nexus.dev` | `password123` |
| **Task 4: Nexus** | Participant | `sarah@nexus.dev` | `password123` |

---

## 🛡️ Zero-Config Database Fallback

To ensure evaluators can test the applications immediately without needing a local MongoDB daemon installed or running, every backend includes an intelligent fallback mechanism:

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

## ✅ CodeAlpha Requirements Checklist

| CodeAlpha Requirement | Project | Implementation Details | Status |
|---|---|---|---|
| **Task 1: Simple E-Commerce Store** | ShopSphere | Full catalog, search, filter, cart, checkout, order tracking, admin CRUD, JWT auth | **100% COMPLETED** |
| **Task 2: Social Media Platform** | Pulse | Dual feeds, post creation, likes, comments, bookmarks, follow graphs, real-time alerts | **100% COMPLETED** |
| **Task 3: Project Management Tool** | FlowBoard | Drag-and-drop Kanban, live socket board sync, task modals, subtasks, project portfolios | **100% COMPLETED** |
| **Task 4: Real-Time Communication** | Nexus | WebRTC audio/video call, screen share, interactive synced Canvas whiteboard, live chat | **100% COMPLETED** |

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) (v9.x or v10.x)
- MongoDB *(Optional — In-memory Mongo automatically activates if not running)*

---

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/codealpha_tasks.git
cd codealpha_tasks
```

### Step 2: Install All Dependencies
Install dependencies across all 4 tasks with a single command:
```bash
npm run install:all
```

### Step 3: Seed Sample Databases
Populate all 4 project databases with rich demo data:
```bash
npm run seed:all
```

---

### Step 4: Running Any Individual Task

#### Run Task 1 (ShopSphere — E-Commerce):
```bash
# Terminal 1: Backend (Port 5000)
cd task-1-ecommerce/backend && npm run dev

# Terminal 2: Frontend (Port 5173)
cd task-1-ecommerce/frontend && npm run dev
```

#### Run Task 2 (Pulse — Social Media):
```bash
# Terminal 1: Backend (Port 5001)
cd task-2-social-media/backend && npm run dev

# Terminal 2: Frontend (Port 5174)
cd task-2-social-media/frontend && npm run dev
```

#### Run Task 3 (FlowBoard — Project Management):
```bash
# Terminal 1: Backend (Port 5002)
cd task-3-project-management/backend && npm run dev

# Terminal 2: Frontend (Port 5175)
cd task-3-project-management/frontend && npm run dev
```

#### Run Task 4 (Nexus — Real-Time Communication):
```bash
# Terminal 1: Backend (Port 5003)
cd task-4-real-time-communication/backend && npm run dev

# Terminal 2: Frontend (Port 5176)
cd task-4-real-time-communication/frontend && npm run dev
```

---

## 📄 License
This repository and all associated projects are open-source and released under the [MIT License](LICENSE).