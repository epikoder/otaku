import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import { fileURLToPath, URL } from "url";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const BACKEND_API = "http://127.0.0.1:5800";
export default defineConfig({
  plugins: [
    vike({}),
    react({}),
    nodePolyfills({
      globals: {
        Buffer: true,
      },
    }),
  ],
  server: {
    proxy: process.env.NODE_ENV == "development"
      ? {
        "/api": {
          target: BACKEND_API,
        },
        "/streams": {
          target: BACKEND_API,
        },
        "/live": {
          target: BACKEND_API,
          ws: true,
        },
      }
      : undefined,
  },
  resolve: {
    alias: [
      {
        find: "@components",
        replacement: fileURLToPath(
          new URL("./components", import.meta.url),
        ),
      },
      {
        find: "@assets",
        replacement: fileURLToPath(
          new URL("./assets", import.meta.url),
        ),
      },
      {
        find: "@utils",
        replacement: fileURLToPath(
          new URL("./utils", import.meta.url),
        ),
      },
      {
        find: "@hooks",
        replacement: fileURLToPath(
          new URL("./hooks", import.meta.url),
        ),
      },
    ],
  },
});
