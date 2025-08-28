import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/register", {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      const { message, success } = response.data;
      if (!success) {
        toast.error(message || "Error registering user");
        return;
      }
      toast.success("User registered successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Error registering user, please try again"
      );
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <div className="flex flex-col items-center w-1/4 bg-white px-8 py-10 rounded-md shadow-md">
        {/* Heading */}
        <div className="text-center mb-12">
          <h3 className="font-bold text-xl text-blue-600 mb-2">PeerLink</h3>
          <p className="text-zinc-600 text-sm">Create an account</p>
          <p className="text-zinc-600 text-xs">Join millions who trust P2P</p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-3 w-full" onSubmit={handleRegisterSubmit}>
          <label htmlFor="name" className="text-sm font-semibold">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label htmlFor="username" className="text-sm font-semibold">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="johndoe123"
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label htmlFor="email" className="text-sm font-semibold">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="password"
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition outline-none"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
