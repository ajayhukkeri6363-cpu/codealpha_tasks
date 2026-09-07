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
**FlowBoard** is an enterprise agile project management and Kanban workspace engineered for **Task 3 of the CodeAlpha Full Stack Development Internship**. Inspired by Linear and Notion, FlowBoard provides smooth HTML5 drag-and-drop card movement, multi-client real-time synchronization over Socket.io, interactive subtask checklists with percentage meters, priority indicators, project portfolios, and team velocity analytics.

---

## ✨ Features Breakdown

### Kanban & Workspace Capabilities
- **HTML5 Drag-and-Drop**: Fluid task card dragging between sprint columns (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`).
- **Real-Time Board Synchronization**: Moving a card in one browser tab broadcasts live updates over Socket.io on port `5002` to all connected team members.
- **Comprehensive Task Modal**: Subtasks checklist with completion percentage progress bar, priority tags (`Low`, `Medium`, `High`, `Urgent`), assignee avatars, custom labels, and task comments.
- **Project Portfolios**: Switch projects with custom key prefixes (e.g. `AETH`, `HYPE`), sprint progress meters, and category filters.
- **Productivity Analytics**: Visual breakdown of task statuses, completion velocity rate, overdue work alerts, and priority distribution.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Axios, Socket.io-client, Date-Fns
- **Backend**: Node.js, Express.js 4, Socket.io 4, Mongoose 8.x, JWT Authentication, Bcrypt.js
- **Database**: MongoDB (with automated `mongodb-memory-server` in-memory fallback)

---

## 🚀 Port Mapping & Environment Variables

| Service | Port | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5175` | React + Vite UI |
| **Backend REST & Sockets** | `http://localhost:5002` | Express REST APIs & Socket.io Engine |

### Backend `.env` Configuration
```env
PORT=5002
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/flowboard_db
JWT_SECRET=flowboard_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5175
```

---

## 🔑 Evaluator Demo Credentials

| Role / Persona | Email | Password | Details |
|---|---|---|---|
| **Elena Rostova (Product Manager)** | `elena@flowboard.dev` | `password123` | Project manager with created portfolios and tasks |
| **Alex Rivera (Tech Lead)** | `alex@flowboard.dev` | `password123` | Tech lead with assigned high-priority sprint items |

---

## 📦 Quick Start Guide

```bash
# 1. Install dependencies
npm run install:all

# 2. Seed database
npm run seed

# 3. Launch Development Servers
npm run dev:backend   # Terminal 1: Port 5002
npm run dev:frontend  # Terminal 2: Port 5175
```

---

## 📡 REST API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/projects` | Private | List user projects with completion % |
| `POST` | `/api/projects` | Private | Create new project portfolio |
| `GET` | `/api/projects/:id` | Private | Fetch single project with tasks & activity |
| `POST` | `/api/tasks` | Private | Create new task & broadcast via socket |
| `POST` | `/api/tasks/reorder` | Private | Update card column & order via drag-drop |
| `PUT` | `/api/tasks/:id` | Private | Update task details, subtasks, priority |
| `GET` | `/api/tasks/:taskId/comments` | Private | Get comments stream for task |
| `GET` | `/api/analytics` | Private | Get board velocity & status analytics |

---

## ⚠️ Known Limitations & Future Roadmap
- Gantt chart timeline view is planned for v2.0.
- GitHub commit linking and webhook triggers are on the upcoming feature roadmap.