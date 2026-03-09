import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { Config } from '../config/env';
import { Storage } from '../utils/storage';

// ─────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: Config.API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// ─────────────────────────────────────────────────────────────
// Request interceptor — attach JWT
// ─────────────────────────────────────────────────────────────
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await Storage.getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// ─────────────────────────────────────────────────────────────
// Response interceptor — handle 401 globally
// A callback can be registered so AuthContext can react to 401.
// ─────────────────────────────────────────────────────────────
type LogoutCallback = () => void;
let _onUnauthorized: LogoutCallback | null = null;

export const registerUnauthorizedCallback = (cb: LogoutCallback) => {
    _onUnauthorized = cb;
};

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            await Storage.clearAll();
            _onUnauthorized?.();
        }
        return Promise.reject(error);
    },
);

export default api;
