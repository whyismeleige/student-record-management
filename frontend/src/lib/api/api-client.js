import axios from "axios";
import toast from "react-hot-toast";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    const isProfileCheck = error.config?.url?.includes("/auth/profile"); 
    if (error.response?.status === 401 && isProfileCheck) {
      return Promise.reject(error);
    }
    toast.error(message);
    return Promise.reject({ message, ...error.response?.data });
  }
);