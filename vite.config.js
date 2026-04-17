import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    // Suprimir la advertencia para chunks < 800 kB (el vendor bundle de React suele rondar 700 kB)
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        // Permite a Rolldown dividir el bundle automáticamente
        codeSplitting: true,
      },
    },
  },
})
