import axios, { AxiosError } from "axios";
import { AuthRoutes } from "constants/routes";
import { env } from '../constants/env';
import { QueryClient } from "@tanstack/react-query";

const client = axios.create({ baseURL: env.API_URL });
const authClient = axios.create({ baseURL: env.API_URL });

client.interceptors.request.use(function(config) {
  const localStore = JSON.parse(localStorage.getItem('lms-local-store') || '{}');

  if (localStore?.state?.token)
    config.headers.Authorization = `Bearer ${localStore.state.token}`;

  return config;
});

client.interceptors.response.use(function(response) {
  return response;
}, function(error: AxiosError) {
  if (error.response?.status === 401) {
    localStorage.removeItem('lms-local-store');
    open(AuthRoutes.login, '_self');
  }
  if (error.isAxiosError) {
    Promise.reject(error);
  }
  return Promise.reject(error);
});

export { client, authClient };


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});
