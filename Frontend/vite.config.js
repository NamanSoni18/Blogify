import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      proxy: {
        "/api": "https://blogify-naman.onrender.com",
      },
    },
    plugins: [react()],
  };
});
