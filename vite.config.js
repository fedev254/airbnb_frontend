import { defineConfig } from 'vite'
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "Abel",           // 🔧 Replace with your actual Sentry org name
      project: "javascript-react" // 🔧 Replace with your Sentry project name
    }),
  ],

  server: {
    historyApiFallback: true, // ✅ Safe fallback for client-side routing
  },

  build: {
    sourcemap: true, // ✅ Required for Sentry source maps
  },
})
