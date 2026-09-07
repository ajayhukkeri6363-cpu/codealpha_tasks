# 🌐 Pulse — Modern Full Stack Social Media & Micro-Blogging Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="Pulse Social Network Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>"Share your world. Find your people."</strong>
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

**Pulse** is a high-performance, real-time social networking and micro-blogging web platform built for **Task 2 of the CodeAlpha Full Stack Development Internship**.

Designed with sleek dark-mode aesthetics, rich interactivity, and sub-second real-time notifications powered by Socket.io, Pulse provides users with a frictionless medium to express their thoughts, discover trending topics, curate bookmarks, and engage with a thriving tech community.

---

## ✨ Key Features

### 1. 🔐 Authentication & Profile Management
- Secure JWT-based registration and authentication with bcrypt password hashing.
- Profile customization: Avatar, Cover Banner, Bio, Location, Website URL, Tech Stack chips.
- Follower/Following relationship graphs with live counters.
- Profile tabs: **Posts**, **Media**, and **Likes**.
- **One-Click Demo Login** buttons for instant evaluator access without manual sign-up.

### 2. 📰 Dynamic Multi-View Feed
- **"For You" Feed**: Algorithmic timeline aggregating content from across the platform and followed creators.
- **"Following" Feed**: Focused chronological view of posts strictly from accounts you follow.
- **Media Previews & Image Attachments**: High-resolution image attachments with lightboxes and URL embeds.
- Hashtag parsing (`#webdev`, `#ai`, `#javascript`) with click-to-filter explore integration.

### 3. 💬 Real-Time Interactions & Reactions
- **Instant Likes & Bookmarks**: Optimistic UI updates with live counts and color transitions.
- **Threaded Comments**: Expandable commenting system with creator badges and timestamps.
- **Real-Time Notification Bell**: Instant alerts over Socket.io for likes, comments, and follows without page reloads.

### 4. 🔍 Explore, Search & Discovery
- Live query search for creators, posts, and hashtags.
- **Trending Topics**: Real-time aggregation of trending hashtags and engagement statistics.
- **Who to Follow Widget**: Recommended profiles with one-click follow/unfollow actions.
- **Saved Bookmarks**: Private personal library of bookmarked posts.

### 5. ⚡ Zero-Config Zero-Friction Runtime
- Automated fallback to in-memory MongoDB (`mongodb-memory-server`) if local MongoDB is not running.
- One-command seeder populating 5 rich creator profiles, 15+ rich media posts, comments, likes, and bookmarks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Date-Fns, Axios, Socket.io-client |
| **Backend** | Node.js, Express.js 4, Socket.io 4, CORS, Dotenv |
| **Database** | MongoDB & Mongoose 8.x with automated `mongodb-memory-server` fallback |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, Helmet, Sanitization |

---

## 🚀 Port Configuration

| Service | Port | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5174` | React + Vite UI |
| **Backend REST & Sockets** | `http://localhost:5001` | Express REST APIs & Socket.io Gateway |

---

## 🔑 Demo Credentials

Evaluators can sign in immediately with pre-configured demo accounts or click the **One-Click Demo** buttons on the login screen:

| Role / Persona | Email | Password |
|---|---|---|
| **Alex Rivera (Senior Full Stack)** | `alex@pulse.dev` | `password123` |
| **Sarah Chen (AI Researcher)** | `sarah@pulse.dev` | `password123` |
| **Marcus Vance (Product Designer)** | `marcus@pulse.dev` | `password123` |
| **Elena Rostova (DevOps Architect)** | `elena@pulse.dev` | `password123` |

---

## 📦 Quick Start Guide

### 1. Install Dependencies
```bash
# From task-2-social-media root
npm run install:all
```

### 2. Seed Database
```bash
npm run seed
```

### 3. Launch Development Servers
In separate terminals:
```bash
# Terminal 1: Backend (Port 5001)
npm run dev:backend

# Terminal 2: Frontend (Port 5174)
npm run dev:frontend
```

Open `http://localhost:5174` in your browser!

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).