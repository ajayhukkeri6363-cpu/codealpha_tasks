# 🌐 Production Deployment Guide — CodeAlpha Full-Stack Monorepo

This guide provides end-to-end deployment instructions for all four full-stack applications in the **`codealpha_tasks`** monorepo:

1. **ShopSphere** (`task-1-ecommerce`) — Full-Stack E-Commerce Platform
2. **Pulse** (`task-2-social-media`) — Social Media Platform
3. **FlowBoard** (`task-3-project-management`) — Kanban Project Management System
4. **Nexus** (`task-4-real-time-communication`) — Real-Time Video Calling & Collaboration Platform

---

## 📊 Deployment Architecture Overview

```
                          ┌────────────────────────────────────────┐
                          │         MongoDB Atlas Cloud DB         │
                          │   (Cluster with 4 Isolated Databases)  │
                          └──────────────────▲─────────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             │                               │                               │
┌────────────┴───────────┐      ┌────────────┴───────────┐      ┌────────────┴───────────┐
│     ShopSphere API     │      │       Pulse API        │      │     FlowBoard API      │
│  (Node.js / Express)   │      │  (Node.js / Express)   │      │  (Node.js / Express)   │
│   Port 5000 / Render   │      │  Port 5001 + Socket.io │      │  Port 5002 + Socket.io │
└────────────▲───────────┘      └────────────▲───────────┘      └────────────▲───────────┘
             │                               │                               │
┌────────────┴───────────┐      ┌────────────┴───────────┐      ┌────────────┴───────────┐
│   ShopSphere Client    │      │      Pulse Client      │      │    FlowBoard Client    │
│    (Vite / React)      │      │     (Vite / React)     │      │     (Vite / React)     │
│   Vercel / Netlify     │      │    Vercel / Netlify    │      │    Vercel / Netlify    │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

---

## 🛠️ Project-by-Project Deployment Matrix

| Project | Frontend Host | Backend Host | Port (Dev) | Database | Real-Time Engine | Key Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Task 1: ShopSphere** | Vercel / Netlify | Render / Railway | `5000` | MongoDB Atlas | REST | Role-based JWT Auth |
| **Task 2: Pulse** | Vercel / Netlify | Render / Railway | `5001` | MongoDB Atlas | Socket.io | Live notifications & feed |
| **Task 3: FlowBoard** | Vercel / Netlify | Render / Railway | `5002` | MongoDB Atlas | Socket.io | Multi-user Kanban sync |
| **Task 4: Nexus** | Vercel / Netlify | Render / Railway | `5003` | MongoDB Atlas | WebRTC + Socket.io | **HTTPS Required** (getUserMedia) |

---

## ☁️ Step 1: MongoDB Cloud Database Setup (Atlas)

All 4 backends support embedded in-memory MongoDB for local testing (`mongodb-memory-server`), but require a cloud MongoDB cluster (such as MongoDB Atlas) for persistent production deployments.

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create an **M0 Free Tier Cluster** (AWS/GCP/Azure).
3. Under **Database Access**, create a database user with read/write privileges (e.g., `codealpha_admin`).
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere for cloud hosts).
5. Retrieve your connection string URI:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/<database_name>?retryWrites=true&w=majority
   ```
6. Set distinct database names for each project:
   - Task 1: `...mongodb.net/shopsphere_prod`
   - Task 2: `...mongodb.net/pulse_prod`
   - Task 3: `...mongodb.net/flowboard_prod`
   - Task 4: `...mongodb.net/nexus_prod`

---

## 🚀 Step 2: Backend Deployment (Render / Railway)

### Recommended: [Render.com](https://render.com) (Free Tier Supported)

For each backend service, create a **Web Service** on Render connected to the GitHub repository:

#### Task 1: ShopSphere Backend
- **Root Directory**: `task-1-ecommerce/backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```ini
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/shopsphere_prod?retryWrites=true&w=majority
  JWT_SECRET=production_strong_secret_key_shopsphere_2026
  CLIENT_URL=https://shopsphere-app.vercel.app
  ```

#### Task 2: Pulse Backend
- **Root Directory**: `task-2-social-media/backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```ini
  NODE_ENV=production
  PORT=5001
  MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/pulse_prod?retryWrites=true&w=majority
  JWT_SECRET=production_strong_secret_key_pulse_2026
  CLIENT_URL=https://pulse-social.vercel.app
  ```

#### Task 3: FlowBoard Backend
- **Root Directory**: `task-3-project-management/backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```ini
  NODE_ENV=production
  PORT=5002
  MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/flowboard_prod?retryWrites=true&w=majority
  JWT_SECRET=production_strong_secret_key_flowboard_2026
  CLIENT_URL=https://flowboard-app.vercel.app
  ```

#### Task 4: Nexus Backend
- **Root Directory**: `task-4-real-time-communication/backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```ini
  NODE_ENV=production
  PORT=5003
  MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/nexus_prod?retryWrites=true&w=majority
  JWT_SECRET=production_strong_secret_key_nexus_2026
  CLIENT_URL=https://nexus-meet.vercel.app
  ```

---

## 💻 Step 3: Frontend Deployment (Vercel / Netlify)

### Recommended: [Vercel](https://vercel.com)

Create a new project on Vercel for each frontend application:

#### Task 1: ShopSphere Frontend
- **Framework Preset**: `Vite`
- **Root Directory**: `task-1-ecommerce/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  ```ini
  VITE_API_URL=https://shopsphere-api.onrender.com/api
  ```

#### Task 2: Pulse Frontend
- **Framework Preset**: `Vite`
- **Root Directory**: `task-2-social-media/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  ```ini
  VITE_API_URL=https://pulse-api.onrender.com/api
  VITE_SOCKET_URL=https://pulse-api.onrender.com
  ```

#### Task 3: FlowBoard Frontend
- **Framework Preset**: `Vite`
- **Root Directory**: `task-3-project-management/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  ```ini
  VITE_API_URL=https://flowboard-api.onrender.com/api
  VITE_SOCKET_URL=https://flowboard-api.onrender.com
  ```

#### Task 4: Nexus Frontend
- **Framework Preset**: `Vite`
- **Root Directory**: `task-4-real-time-communication/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  ```ini
  VITE_API_URL=https://nexus-api.onrender.com/api
  VITE_SOCKET_URL=https://nexus-api.onrender.com
  ```

---

## 🔒 Step 4: Critical Production Requirements & Guidelines

### 1. HTTPS / SSL Requirement for WebRTC (Nexus)
* WebRTC APIs (`navigator.mediaDevices.getUserMedia` and `navigator.mediaDevices.getDisplayMedia`) **require a secure origin (`HTTPS`)** in all modern browsers (Chrome, Safari, Firefox, Edge).
* Vercel and Render automatically provide free, automatic SSL certificates (`https://`).

### 2. Socket.io Transports & CORS
* In production, the backend `CLIENT_URL` must match the deployed frontend URL (e.g., `https://pulse-social.vercel.app`) to permit WebSocket handshakes and CORS requests.
* Sockets support both `websocket` and `polling` transports automatically.

### 3. Database Persistence
* When deploying to Render/Railway, set `MONGODB_URI` / `MONGO_URI` to a real MongoDB Atlas URI so that registered users, products, boards, and chats persist across container restarts.

### 4. Render Free-Tier Cold Starts
* Render free-tier services spin down after 15 minutes of inactivity. The first request may experience a ~30 second cold-start delay. All frontends feature loading indicators and timeout error handling to manage this gracefully.

---

## 📋 Production Build & Test Commands

To test production builds locally before deploying:

```bash
# 1. ShopSphere (Task 1)
cd task-1-ecommerce/frontend && npm run build
cd ../backend && npm start

# 2. Pulse (Task 2)
cd task-2-social-media/frontend && npm run build
cd ../backend && npm start

# 3. FlowBoard (Task 3)
cd task-3-project-management/frontend && npm run build
cd ../backend && npm start

# 4. Nexus (Task 4)
cd task-4-real-time-communication/frontend && npm run build
cd ../backend && npm start
```

---

## ✅ Pre-Deployment Verification Checklist

- [x] All 4 frontend production builds compile cleanly with zero errors (`dist/` generated).
- [x] `VITE_API_URL` and `VITE_SOCKET_URL` are configurable via environment variables in all frontends.
- [x] CORS middleware is configured dynamically via `process.env.CLIENT_URL`.
- [x] All database models support MongoDB Atlas connection strings.
- [x] Passwords are securely hashed with `bcryptjs` salt rounds.
- [x] Zero real secrets or private keys are committed in Git.
- [x] `.gitignore` excludes `.env`, `node_modules/`, and local build outputs.
