import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  // base will be the BASE_URL set for production and the static files will be served after that
  base: "./",
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000
  },
})
