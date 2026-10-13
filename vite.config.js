import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/school-information-system/",
  build: { sourcemap: false },
  plugins: [react()],
});
