import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  base: "/instui-markdown/",
  plugins: [react()],
  fmt: {},
});
