import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        vendor: JSON.parse(localStorage.getItem('vendor')) || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(email, password) {
            try {
                const response = await api.post('/api/vendor/auth/login', { email, password });
                const { token, vendor } = response.data;

                this.token = token;
                this.vendor = vendor;

                localStorage.setItem('token', token);
                localStorage.setItem('vendor', JSON.stringify(vendor));

                return true;
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        logout() {
            this.token = null;
            this.vendor = null;
            localStorage.removeItem('token');
            localStorage.removeItem('vendor');
            // Router redirect should be handled in the component or router
        },
        // Optional: specific action to fetch profile if needed separately
        async fetchProfile() {
            try {
                const response = await api.get('/api/vendor/profile');
                this.vendor = response.data;
                localStorage.setItem('vendor', JSON.stringify(this.vendor));
            } catch (error) {
                console.error('Fetch profile failed:', error);
            }
        }
    },
});
