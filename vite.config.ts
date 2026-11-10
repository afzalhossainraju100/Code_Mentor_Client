import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Firebase keeps a registry of services inside @firebase/app. If two copies get bundled
    // (npm can nest different versions), auth registers in one copy and the app reads the other:
    // "Component auth has not been registered yet". Dedupe forces one shared copy.
    dedupe: ['@firebase/app', '@firebase/component', '@firebase/util', '@firebase/logger'],
  },
})
