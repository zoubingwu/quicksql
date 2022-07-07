import { defineConfig } from 'vite'

const outDir = new URL('../service/dist', import.meta.url).toString()

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: outDir.replace('file://', '')
  }
})