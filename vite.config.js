import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Transpile for older Safari/iOS and Firefox ESR as well as current browsers.
    target: ["es2020", "chrome87", "safari14", "firefox78", "edge88"],
    sourcemap: false,
  },
});
