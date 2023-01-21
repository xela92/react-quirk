import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/lib/index.ts',
      name: 'quirk',
      fileName: (format) => `quirk.${format}.js`
    }
  }
})
