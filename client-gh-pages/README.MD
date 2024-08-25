# Description
Steps to make github pages project with react vite

# Steps
 - 1 - make react app
 ```bash
 npm create vite@latest # and do what said vite
 # do what said vite
 npm install gh-pages # needed
 ```

 - 1.2 - add to git
 - 2 - change configs
 package.json
 ```json
 {
    "scripts": {
        "build": "tsc -b && vite build",
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
    },
 }
 ```

 vite.config.ts (im use typescript)
 ```ts
 import { defineConfig } from 'vite'
 import react from '@vitejs/plugin-react'
 
 const basepath = "/app" // app its name or repo
 // getting basepath
 export default defineConfig({
   base: basepath + "/",
   plugins: [react()],
 })
 ```
 - 3 - make react app (with route without route its doesnt metter)
 - 3.1 - use HashRouter instant BrowserRouter (if you use route use HashRouter)
 - 4 - add to github pages
 ```bash
 npm run deploy
 ```
 - 5 - get link in github->repo->setting->pages
 - 6 - have fun with your new github pages app