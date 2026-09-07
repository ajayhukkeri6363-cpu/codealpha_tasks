# 🎥 Nexus — Real-Time Video Conferencing & Collaborative Whiteboard Platform

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
  <img src="https://img.shields.io/badge/WebRTC-Mesh-red.svg?logo=webrtc" alt="WebRTC" />
  <img src="https://img.shields.io/badge/Socket.io-4.8-010101.svg?logo=socket.io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/License-MIT-purple.svg" alt="License" />
</p>

---

## 📌 Project Overview

**Nexus** is a real-time communication and video collaboration platform engineered for **Task 4 of the CodeAlpha Full Stack Development Internship**.

Nexus allows teams to launch low-latency encrypted video and audio calls, screen share, interact on an HTML5 synchronized vector whiteboard in real time, and chat in dedicated in-meeting messaging channels without installing any desktop software or third-party plugins.

---

## ✨ Key Features

### 1. 📹 WebRTC Audio & Video Calling
- P2P mesh audio/video streaming with adaptive participant grid layout.
- Camera toggle (On/Off) and Microphone mute/unmute.
- **Screen Sharing**: Native display capture streaming directly to connected peers.
- Device setup preview in lobby with hardware verification before entering rooms.

### 2. 🎨 Synchronized Collaborative Whiteboard
- HTML5 Canvas vector drawing engine synchronized across all peers in sub-10ms latency over Socket.io.
- **Tools**: Freehand Pen, Eraser, Line, Rectangle, Circle, and Clear Canvas.
- Color palette selector and dynamic stroke width slider.
- High-resolution PNG image export with one-click download.

### 3. 💬 Real-Time In-Meeting Chat
- Persistent meeting chat stream with participant avatars, timestamps, and active user badges.
- Slide-over chat drawer with unread message counter badge.

### 4. 👥 Room Management & Instant Link Sharing
- Instant room generator with human-readable room IDs (e.g. `design-sprint`, `eng-sync`).
- Connected participant roster with live indicators.

### 5. 🛠️ Zero-Config Database
- Automatic fallback to embedded MongoDB (`mongodb-memory-server`) if a local Mongo server is not active.
- Comprehensive seeder script with pre-configured meeting rooms and messages.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Date-Fns, Axios, Socket.io-client, HTML5 Canvas |
| **Backend** | Node.js, Express.js 4, Socket.io 4, CORS, Dotenv |
| **Database** | MongoDB & Mongoose 8.x with automated `mongodb-memory-server` fallback |
| **Communication** | WebRTC MediaStream API, WebSockets (Socket.io) |

---

## 🚀 Port Configuration

| Service | Port | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5176` | React + Vite UI |
| **Backend REST & Signaling** | `http://localhost:5003` | Express REST APIs & WebRTC Signaling Gateway |

---

## 🔑 Demo Credentials

Evaluators can sign in immediately with pre-configured demo accounts or click the **One-Click Demo** buttons on the sign-in screen:

| Role / Persona | Email | Password |
|---|---|---|
| **Marcus Vance (Host / Lead)** | `marcus@nexus.dev` | `password123` |
| **Alex Rivera (Tech Lead)** | `alex@nexus.dev` | `password123` |
| **Elena Rostova (Product Manager)** | `elena@nexus.dev` | `password123` |
| **Sarah Chen (AI Researcher)** | `sarah@nexus.dev` | `password123` |

---

## 📦 Quick Start Guide

### 1. Install Dependencies
```bash
# From task-4-real-time-communication root
npm run install:all
```

### 2. Seed Database
```bash
npm run seed
```

### 3. Launch Development Servers
In separate terminals:
```bash
# Terminal 1: Backend (Port 5003)
npm run dev:backend

# Terminal 2: Frontend (Port 5176)
npm run dev:frontend
```

Open `http://localhost:5176` in your browser!

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).