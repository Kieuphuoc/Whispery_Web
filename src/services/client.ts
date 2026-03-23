import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { storage } from '@/app/storage';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// User API instance
export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storage.get('token') || localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin API instance
export const adminApi = axios.create({
  baseURL: BASE_URL,
});

adminApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
