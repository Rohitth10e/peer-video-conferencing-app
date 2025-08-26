import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';


function LoginForm() {

  const [formData, setFormData] = useState({
    email:"",
    password:""
  });

  async function handleLoginSubmit(e){
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:8000/api/v1/users/login",{
            username: formData.email,
            password: formData.password
        })

        const { success, message } = response.data;
        const { token } = response.data?.data
        if(!success){
            toast.error(message || "Invalid credentials")
            return;
        }
        localStorage.setItem("authToken",token)
        toast.success("Login successful")
    } catch(err: any) {
        toast.error(
            err.response?.data?.message || "Error logging in, please try again"
        );
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <div className="flex flex-col items-center w-1/4 bg-white px-8 py-10 rounded-md shadow-md">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h3 className="font-bold text-xl text-blue-600 mb-2">P2P</h3>
          <p className="text-zinc-600 text-sm">Sign In</p>
          <p className="text-zinc-600 text-xs">
            stay connected with reliable HD video and audio
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-3 w-full" onSubmit={handleLoginSubmit}>
          <label htmlFor="email" className="text-sm font-semibold">
            Email Address
          </label>
          <input
            id="email"
            type="text"
            value={formData.email}
            onChange={(e)=>setFormData({...formData, email:e.target.value})}
            placeholder="john@company.com"
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e)=>setFormData({...formData, password: e.target.value})}
            placeholder="password"
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition outline-none"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
