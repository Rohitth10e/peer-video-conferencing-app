# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
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
