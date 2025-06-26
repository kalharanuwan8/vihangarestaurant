// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Proxy handles localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Change to true if using cookies/session auth
});

export default axiosInstance;
