import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
// Config updated
export default defineConfig({
    plugins: [vue()],
    base: '/vendor/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5002,
        host: true,
        strictPort: true,
        allowedHosts: ['consecratory-circinately-shad.ngrok-free.dev'],
        proxy: {
            '/vendor/api': {
                target: 'http://localhost:8082',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/vendor/, '')
            }
        }
    }
})
