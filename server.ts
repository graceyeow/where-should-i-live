import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './api/index';
import feedHandler from './api/feed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Parse CLI args (e.g. --port 3000 --host 0.0.0.0) or fallback to env / 3000
  const args = process.argv.slice(2);
  const portArgIdx = args.indexOf('--port');
  const hostArgIdx = args.indexOf('--host');
  const cliPort = portArgIdx !== -1 ? args[portArgIdx + 1] : null;
  const cliHost = hostArgIdx !== -1 ? args[hostArgIdx + 1] : null;

  const PORT = parseInt(cliPort || process.env.PORT || '3000', 10);
  const HOST = cliHost || process.env.HOST || '0.0.0.0';
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount RSS 2.0 Feed endpoint
  app.get('/api/feed', feedHandler);

  // Mount /api endpoints
  app.use('/api', apiRouter);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
