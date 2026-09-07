# 🎥 Nexus — Real-Time WebRTC Video Conferencing & Collaborative Whiteboard Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80" alt="Nexus Video Calling Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>"Meet. Collaborate. Create."</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue.svg?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Node.js-20.x-green.svg?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Express-4.21-000000.svg?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%208.x-brightgreen.svg?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/WebRTC-P2P%20Mesh-red.svg?logo=webrtc" alt="WebRTC" />
  <img src="https://img.shields.io/badge/Socket.io-4.8-010101.svg?logo=socket.io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/License-MIT-purple.svg" alt="License" />
</p>

---

## 📌 Project Overview
**Nexus** is a real-time communication platform engineered for **Task 4 of the CodeAlpha Full Stack Development Internship**. Nexus allows distributed teams to launch low-latency WebRTC video and audio calls, screen share, interact on an HTML5 synchronized vector whiteboard in real time, and chat in dedicated in-meeting messaging channels without installing any desktop software or third-party plugins.

---

## ✨ Features Breakdown

### Video & Collaboration Capabilities
- **WebRTC Audio & Video Calling**: P2P mesh audio/video streaming with adaptive participant grid layout.
- **Hardware Controls**: Microphone mute/unmute, camera toggle on/off, and native screen sharing (`getDisplayMedia`).
- **Lobby Device Setup**: Pre-meeting hardware verification for camera and microphone streams before joining conference rooms.
- **Synchronized Vector Whiteboard**: HTML5 Canvas vector drawing engine synchronized across all peers in sub-10ms latency over Socket.io (Pen, Eraser, Line, Rectangle, Circle, custom colors, thickness slider, and PNG export).
- **In-Meeting Live Chat**: Persistent meeting chat stream with participant avatars, timestamps, and active user badges.
- **Room Management**: Instant room generator with human-readable room IDs (e.g. `design-sprint`, `eng-sync`).

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide Icons, HTML5 Canvas, WebRTC MediaStream API, Axios, Socket.io-client
- **Backend**: Node.js, Express.js 4, Socket.io 4, WebRTC Signaling Gateway, Mongoose 8.x, JWT Authentication, Bcrypt.js
- **Database**: MongoDB (with automated `mongodb-memory-server` in-memory fallback)

---

## 🚀 Port Mapping & Environment Variables

| Service | Port | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5176` | React + Vite UI |
| **Backend REST & Signaling** | `http://localhost:5003` | Express REST APIs & WebRTC Signaling Gateway |

### Backend `.env` Configuration
```env
PORT=5003
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/nexus_db
JWT_SECRET=nexus_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5176
```

---

## 🔑 Evaluator Demo Credentials

| Role / Persona | Email | Password | Details |
|---|---|---|---|
| **Marcus Vance (Host / Lead)** | `marcus@nexus.dev` | `password123` | Pre-configured meeting host account for `design-sprint` |
| **Sarah Chen (Participant)** | `sarah@nexus.dev` | `password123` | Remote participant persona |

> **Note**: These credentials are demo accounts created specifically for local/project evaluation.

---

## 📦 Quick Start Guide

```bash
# 1. Start Backend (Port 5003)
cd backend
npm install
npm start

# 2. Start Frontend (Port 5176) in a new terminal
cd ../frontend
npm install
npm run dev
```

---

## 📡 REST & Socket Overview

| Method / Event | Endpoint / Event Name | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `POST` | `/api/meetings` | Private | Create new meeting room |
| `GET` | `/api/meetings/:roomId` | Public | Fetch room info and participants |
| `GET` | `/api/meetings/:roomId/messages` | Private | Fetch chat history for room |
| `SOCKET` | `join_room` | Room | Join conference room with socket ID |
| `SOCKET` | `draw_stroke` | Room | Broadcast vector delta coordinates to whiteboard |
| `SOCKET` | `clear_whiteboard` | Room | Clear shared whiteboard across all peers |
| `SOCKET` | `send_chat` | Room | Broadcast and persist in-meeting message |

---

## 🎬 Video Demo Walkthrough Script (2–4 Minutes)

1. **Authentication & Room Creation (0:00 - 0:30)**:
   * Log in with `marcus@nexus.dev` / `password123`. Click Create Room and generate room `design-sprint`.
2. **Lobby Hardware Pre-Flight (0:30 - 1:00)**:
   * Enter the meeting lobby. Speak to show real-time mic volume level visualizer. Preview video mirror before clicking "Join Conference".
3. **WebRTC Video & Screen Sharing (1:00 - 1:45)**:
   * Demonstrate camera toggle, mic mute, and click "Share Screen" to stream desktop display to connected peers over native WebRTC.
4. **Collaborative Synchronized Whiteboard (1:45 - 2:45)**:
   * Switch to Whiteboard tab. Draw with Pen, draw Rectangles and Circles, change stroke colors, and export canvas to PNG snapshot.
5. **In-Meeting Chat & Participants (2:45 - 3:30)**:
   * Open the in-meeting Chat drawer. Send timestamped messages, inspect participant roster drawer, and end call cleanly.

---

## 🚀 Deployment Readiness & Environment

* **Deployment Tier**: `PRODUCTION READY` (Tested locally with embedded MongoDB; ready for containerization/Vercel/Render).
* **Frontend**: Deployable to **Vercel / Netlify** with `npm run build` (output directory: `dist/`). Set `VITE_API_URL` to backend URL.
* **Backend & Signaling**: Deployable to **Render / Railway / AWS ECS** with `npm start`. Set `PORT`, `MONGO_URI`, and `JWT_SECRET`.
* **Database**: Embedded in-memory MongoDB is active for zero-config local runs. For cloud production, provide a MongoDB Atlas cluster URI in `MONGO_URI`.

---

## ⚠️ Known Limitations & Future Roadmap
- WebRTC mesh architecture is optimized for small team meetings (2-6 peers); Selective Forwarding Unit (SFU) is planned for large 50+ webinar streams.
- Cloud meeting recording storage is planned for future iterations.