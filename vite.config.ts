import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Honor an assigned port (e.g. from the preview harness) but fall back to Vite's default.
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    target: "es2020",
    cssMinify: true,
  },
});
