import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { visualizer } from 'rollup-plugin-visualizer';
import windicss from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), windicss()],
  define: {
    'process.env': {},
  },
  build: {
    rollupOptions: {
      plugins: [
        visualizer()
      ]
    }
  }
})
