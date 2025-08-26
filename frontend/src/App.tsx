import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm/>} />
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
    </>
  )
}

export default App