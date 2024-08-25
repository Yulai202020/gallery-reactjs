import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import config from "./src/config.json";

// getting basepath
export default defineConfig({
  base: config.basepath + "/",
  plugins: [react()],
})
