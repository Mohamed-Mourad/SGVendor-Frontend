import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [vue()],
        base: env.VITE_BASE_URL || '/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: 5002,
            host: true,
            strictPort: true,
            allowedHosts: 'all',
            proxy: {
                '/vendor/api': {
                    target: 'http://localhost:8082',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/vendor/, '')
                }
            }
        }
    }
})

