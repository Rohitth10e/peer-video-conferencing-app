import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import {ProtectedRoute} from "./hooks/useAuth.ts";
import {UserProvider} from "./context/UserContext.tsx";
import Profile from "./pages/profile/Profile.tsx";
import VideoMeet from "./pages/Video-meet/VideoMeet.tsx";

function App() {
  return (
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
            />
              <Route
              path="/profile"
              element={
                  <ProtectedRoute>
                      <Profile />
                  </ProtectedRoute>
              }
              />
              <Route
                  path="/:url"
                  element={
                      <ProtectedRoute>
                          <VideoMeet />
                      </ProtectedRoute>
                  }
              />
          </Routes>
          <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
          />
        </Router>
      </UserProvider>
  )
}


export default App