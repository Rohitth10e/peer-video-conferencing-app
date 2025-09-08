import axios from "axios";

const api = axios.create({
    // IMPORTANT: Changed this to a relative path
    // Now Vite's proxy will catch this request.
    baseURL: "/api/v1",
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
