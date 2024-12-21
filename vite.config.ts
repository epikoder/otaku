import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [vike({}), react({})],
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
    ],
  },
});
