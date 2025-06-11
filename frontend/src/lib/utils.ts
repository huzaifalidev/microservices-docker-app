import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// const axiosInstance = axios.create({
//   baseURL: "http://", // Replace with your actual API URL
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor to add token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("adminToken"); // get token from localStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;
