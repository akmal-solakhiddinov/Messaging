import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import process from "process";

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'process': 'process/browser',
    },
  },

  server: {
    host: '0.0.0.0',
    origin: '0.0.0.0'
  },

  define: {
    'process.env': process.env
  }
});
