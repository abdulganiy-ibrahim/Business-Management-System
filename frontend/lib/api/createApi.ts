// lib/api/createApi.ts
import axios from 'axios';

export function createApi(getToken: () => Promise<string | undefined>) {
  const instance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

  instance.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return instance;
}