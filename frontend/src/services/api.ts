import axios from 'axios';
import { expireAuthSession, isTokenExpired } from './authSession';

const api = axios.create({ baseURL: 'http://localhost:8080' });

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
