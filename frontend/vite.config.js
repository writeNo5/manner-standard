import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// API Plugin to allow the Admin Dashboard to save changes to JSON locally
const apiPlugin = {
  name: 'api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/save_db' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            fs.writeFileSync('public/manner_db.json', JSON.stringify(data, null, 4));
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          } catch(e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin],
})
