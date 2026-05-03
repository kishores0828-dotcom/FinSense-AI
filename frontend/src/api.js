import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Ensure this matches your FastAPI port
});

// This part adds the token to the "Header" of every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;