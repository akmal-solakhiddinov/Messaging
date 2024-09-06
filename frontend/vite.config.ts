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


  define: {
    'process.env': process.env
  }
});
