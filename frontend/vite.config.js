import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';
const root = process.cwd();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(root, '..', 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(root, '..', 'localhost.pem')),
    },
    port: 443,
    host: 'localhost',
  },
})
