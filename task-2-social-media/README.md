# 🌐 Pulse — Modern Full-Stack Social Media & Micro-Blogging Platform

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
**Pulse** is a real-time social networking and micro-blogging platform engineered for **Task 2 of the CodeAlpha Full Stack Development Internship**. It offers dual-view feeds ("For You" and "Following"), post creation with image attachments, hashtag filtering, optimistic likes with heart micro-animations, expandable threaded comments, bookmarked posts vault, user follow graphs, and sub-second notification alerts over Socket.io.

---

## ✨ Features Breakdown

### Core Platform Capabilities
- **Dual Feed Views**: Switch seamlessly between algorithmic **"For You"** feed and chronological **"Following"** feed.
- **Rich Post Composer**: Create posts with image URL attachments, preview cards, and auto-linked hashtag parsing (`#webdev`, `#ai`).
- **Reactive Interactions**: Optimistic likes with heart micro-animations, bookmarked posts vault, and threaded expandable comments.
- **Real-Time Notification Bell**: Instant alert toasts and badge increments over Socket.io when someone likes or comments on your post.
- **User Profiles**: Custom avatars, cover banners, bios, location, tech stack chips, follower graphs, and activity tabs.
- **Mobile Navigation**: Native bottom tab bar (`Feed`, `Explore`, `Create (+)`, `Notifications`, `Saved`, `Profile`) for seamless mobile UX.
- **Explore & Trending Hub**: Real-time trending hashtags sidebar, live creator search, and "Who to Follow" recommendation widgets.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Axios, Socket.io-client
- **Backend**: Node.js, Express.js 4, Socket.io 4, Mongoose 8.x, JWT Authentication, Bcrypt.js
- **Database**: MongoDB (with automated `mongodb-memory-server` in-memory fallback)

---

## 🚀 Port Mapping & Environment Variables

| Service | Port | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5174` | React + Vite UI |
| **Backend REST & Sockets** | `http://localhost:5001` | Express REST APIs & Socket.io Engine |

### Backend `.env` Configuration
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/pulse_db
JWT_SECRET=pulse_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5174
```

---

## 🔑 Evaluator Demo Credentials

| Role / Persona | Email | Password | Details |
|---|---|---|---|
| **Alex Rivera (Lead Full Stack)** | `alex@pulse.dev` | `password123` | Active creator profile with posts and followers |
| **Sarah Chen (AI Researcher)** | `sarah@pulse.dev` | `password123` | AI researcher persona with rich media posts |

---

## 📦 Quick Start Guide

```bash
# 1. Install dependencies
npm run install:all

# 2. Seed database
npm run seed

# 3. Launch Development Servers
npm run dev:backend   # Terminal 1: Port 5001
npm run dev:frontend  # Terminal 2: Port 5174
```

---

## 📡 REST API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/posts/feed` | Private | Fetch algorithmic & following feeds |
| `POST` | `/api/posts` | Private | Create new post with hashtags & media |
| `PUT` | `/api/posts/:id/like` | Private | Toggle like on post |
| `GET` | `/api/comments/post/:postId` | Private | Get threaded comments on post |
| `POST` | `/api/comments/post/:postId` | Private | Add comment & trigger socket notification |
| `POST` | `/api/saved/:postId` | Private | Toggle bookmark on post |
| `PUT` | `/api/users/:id/follow` | Private | Follow / unfollow user |
| `GET` | `/api/notifications` | Private | Fetch user notification stream |

---

## ⚠️ Known Limitations & Future Roadmap
- Direct 1-on-1 private messaging is scheduled for the next major release.
- Image uploads currently use hosted URL embeds; S3 cloud storage integration is planned.