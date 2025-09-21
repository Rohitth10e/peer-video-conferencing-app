# 📹 PeerLink

PeerLink is a **real-time video meeting application** built with **WebRTC, Socket.IO, React, and Node.js**.  
It allows users to **create, schedule, and join meetings** with features like authentication, scheduling, and media controls.

---

## Features

- **Authentication**
    - User login/signup with JWT
    - Secure routes and localStorage-based auth token

- **Meeting Management**
    - Create instant meetings
    - Schedule meetings with `date`, `time`, and `duration`
    - Meeting status lifecycle: `scheduled → ongoing → ended`

- **Join Meetings**
    - Join via `meetingCode`
    - Frontend validations for meeting ID, time, and scheduling

- **Media Controls**
    - Enable/disable microphone and camera before joining
    - Preview video feed before entering the room

- **Real-time Communication**
    - WebRTC peer-to-peer media streaming
    - Socket.IO signaling server
    - Up to multiple participants per room

-  **UI/UX**
    - Built with **React + TailwindCSS**
    - Minimalist blue/white theme
    - Responsive layouts (meeting lobby, video grid, dashboard)

---

## Tech Stack

### Frontend
- [React (Vite)](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Socket.IO Client](https://socket.io/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)

### Database Models
- **User**
    - username, email, password (hashed)
- **Meeting**
    - meetingCode (UUID, unique)
    - meetingName
    - user_id (creator)
    - scheduledAt (Date)
    - duration (minutes)
    - status: `scheduled | ongoing | ended`

---

##  Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/peerlink.git
cd peerlink