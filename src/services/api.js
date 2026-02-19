import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8082',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Add Accept-Language if needed, defaulting to 'en'
        config.headers['Accept-Language'] = localStorage.getItem('locale') || 'en';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth data and redirect to login if unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('vendor');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
