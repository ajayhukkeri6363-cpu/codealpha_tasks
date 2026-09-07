# 📋 FlowBoard — Enterprise Project Management & Real-Time Kanban Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=1200&q=80" alt="FlowBoard Kanban Platform Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>"Plan. Collaborate. Ship."</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue.svg?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Node.js-20.x-green.svg?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Express-4.21-000000.svg?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%208.x-brightgreen.svg?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-4.8-010101.svg?logo=socket.io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/License-MIT-purple.svg" alt="License" />
</p>

---

## 📌 Project Overview

**FlowBoard** is a modern, real-time project management and Kanban workspace designed for **Task 3 of the CodeAlpha Full Stack Development Internship**.

Built to streamline team collaboration, FlowBoard features smooth drag-and-drop card movement, multi-column sprint workflows (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`), interactive subtask checklists with progress tracking, multi-criteria filters, productivity analytics, and live synchronization over Socket.io across all connected clients.

---

## ✨ Key Features

### 1. 🎯 Interactive Kanban Workspace
- **Drag & Drop Reordering**: Fluid HTML5 card dragging across columns with optimistic UI updates and instant database persistence.
- **Sprint Columns**: `Backlog`, `To Do`, `In Progress`, `In Review`, and `Done` with dynamic task counters.
- **Task Prioritization**: `Low`, `Medium`, `High`, and `Urgent` visual badges with pulsing animations.
- **Subtask Progress**: Interactive checkbox checklists with completion percentage progress bars.

### 2. ⚡ Real-Time Socket.io Synchronization
- Multi-client live board synchronization on port `5002`.
- When an engineer drops a card or posts a comment in one browser, all connected team members see the board update in real time without refreshing.

### 3. 🔍 Deep Search & Multi-Facet Filtering
- Instant debounced search querying task keys (e.g. `AETH-1`), titles, and tag labels.
- Priority and Assignee facet filtering.
- One-click project switcher dropdown.

### 4. 📊 Productivity & Velocity Analytics
- High-level KPI metrics: Active Projects, Total Sprint Tasks, Completion Rate %, and Overdue items.
- Dynamic visual charts for **Task Status Distribution** and **Priority Breakdown**.

### 5. 🛠️ Zero-Config In-Memory Fallback
- Automatic fallback to embedded MongoDB (`mongodb-memory-server`) if a local Mongo daemon is unavailable.
- Rich seeder script populating 4 team personas, 2 active engineering projects, and comprehensive multi-column tasks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Date-Fns, Axios, Socket.io-client |
| **Backend** | Node.js, Express.js 4, Socket.io 4, CORS, Dotenv |
| **Database** | MongoDB & Mongoose 8.x with automated `mongodb-memory-server` fallback |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, Sanitization |

---

## 🚀 Port Configuration

| Service | Port | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5175` | React + Vite UI |
| **Backend REST & Sockets** | `http://localhost:5002` | Express REST APIs & Socket.io Engine |

---

## 🔑 Demo Credentials

Evaluators can sign in immediately with pre-configured demo accounts or click the **One-Click Demo** buttons on the sign-in screen:

| Role / Persona | Email | Password |
|---|---|---|
| **Elena Rostova (Product Manager)** | `elena@flowboard.dev` | `password123` |
| **Alex Rivera (Tech Lead)** | `alex@flowboard.dev` | `password123` |
| **Sarah Chen (Senior Full Stack)** | `sarah@flowboard.dev` | `password123` |
| **Marcus Vance (UI/UX Designer)** | `marcus@flowboard.dev` | `password123` |

---

## 📦 Quick Start Guide

### 1. Install Dependencies
```bash
# From task-3-project-management root
npm run install:all
```

### 2. Seed Database
```bash
npm run seed
```

### 3. Launch Development Servers
In separate terminals:
```bash
# Terminal 1: Backend (Port 5002)
npm run dev:backend

# Terminal 2: Frontend (Port 5175)
npm run dev:frontend
```

Open `http://localhost:5175` in your browser!

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).