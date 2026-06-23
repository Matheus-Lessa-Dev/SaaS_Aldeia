import axios from 'axios';
import { expireAuthSession, isTokenExpired } from './authSession';

const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL;
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (configuredUrl && !configuredUrl.includes('localhost')) {
    return configuredUrl;
  }

  if (isLocalhost) {
    return 'http://localhost:8080';
  }

  return `${window.location.protocol}//${hostname}:8080`;
};

const api = axios.create({ baseURL: getApiBaseUrl() });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    expireAuthSession();
    return Promise.reject(new axios.Cancel('Sessão expirada.'));
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url ?? '';

    if (status === 401 && !requestUrl.includes('/auth/login')) {
      expireAuthSession();
    }

    return Promise.reject(error);
  },
);

export default api;
