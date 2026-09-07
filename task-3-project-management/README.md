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

> **Note**: These credentials are demo accounts created specifically for local/project evaluation.

---

## 📦 Quick Start Guide

```bash
# 1. Start Backend (Port 5002)
cd backend
npm install
npm start

# 2. Start Frontend (Port 5175) in a new terminal
cd ../frontend
npm install
npm run dev
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

## 🎬 Video Demo Walkthrough Script (2–4 Minutes)

1. **Authentication & Project Dashboard (0:00 - 0:30)**:
   * Log in with `elena@flowboard.dev` / `password123`. Tour workspace dashboard cards and sprint progress metrics.
2. **Project Creation & Key Generation (0:30 - 1:00)**:
   * Create a new project (e.g. "Cloud Infra Migration", Key: `CLOU`). Add team members and set deadlines.
3. **Kanban Board & Drag-and-Drop (1:00 - 1:45)**:
   * Open "Aether UI" Kanban board. Fluidly drag a task card from `In Progress` to `In Review` to observe instant re-indexing and Socket.io broadcast.
4. **Task Card Deep-Dive & Subtasks (1:45 - 2:30)**:
   * Click on task card `AETH-2`. Toggle subtask checklist items to see dynamic completion % progress meter update in real time.
5. **Comments & Priority Badges (2:30 - 3:00)**:
   * Add a collaboration comment to the task discussion stream. Change priority tag from `High` to `Urgent`.
6. **Project Analytics & Velocity (3:00 - 3:30)**:
   * Navigate to Analytics view to inspect velocity rates, status distribution breakdown, and overdue task alerts.

---

## 🚀 Deployment Readiness & Environment

* **Deployment Tier**: `PRODUCTION READY` (Tested locally with embedded MongoDB; ready for containerization/Vercel/Render).
* **Frontend**: Deployable to **Vercel / Netlify** with `npm run build` (output directory: `dist/`). Set `VITE_API_URL` to backend URL.
* **Backend**: Deployable to **Render / Railway / AWS ECS** with `npm start`. Set `PORT`, `MONGO_URI`, and `JWT_SECRET`.
* **Database**: Embedded in-memory MongoDB is active for zero-config local runs. For cloud production, provide a MongoDB Atlas cluster URI in `MONGO_URI`.

---

## ⚠️ Known Limitations & Future Roadmap
- Gantt chart timeline view is planned for v2.0.
- GitHub commit linking and webhook triggers are on the upcoming feature roadmap.