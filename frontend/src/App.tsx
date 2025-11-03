import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast-custom.css";

import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import {ProtectedRoute} from "./hooks/useAuth.tsx";
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
              {/*<Route*/}
              {/*    path="/:url"*/}
              {/*    element={*/}
              {/*        <ProtectedRoute>*/}
              {/*            <VideoMeet />*/}
              {/*        </ProtectedRoute>*/}
              {/*    }*/}
              {/*/>*/}
              <Route path="/meetings" element={
                  <ProtectedRoute>
                      <VideoMeet/>
                  </ProtectedRoute>
              } />

              <Route path="/meeting/:id" element={
                  <ProtectedRoute>
                      <VideoMeet/>
                  </ProtectedRoute>
              } />
          </Routes>
          <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
              limit={3}
              style={{
                top: '1rem',
                right: '1rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
              toastStyle={{
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                padding: '1rem',
              }}
          />
        </Router>
      </UserProvider>
  )
}


export default App