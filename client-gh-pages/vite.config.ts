import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { basepath } from "./src/config.json";

// getting basepath
export default defineConfig({
  base: basepath + "/",
  plugins: [react()],
})
