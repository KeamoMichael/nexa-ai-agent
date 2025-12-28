import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

// Serve static files from the Vite build output
app.use(express.static(join(__dirname, '../dist')));

// SPA fallback: serve index.html for all non-file requests (Express 5.x compatible)
app.use((req, res, next) => {
  // If the request is not for a file (no extension), serve index.html
  if (!req.path.includes('.')) {
    res.sendFile(join(__dirname, '../dist/index.html'));
  } else {
    next();
  }
});

const httpServer = createServer(app);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Manus AI Server running on http://0.0.0.0:${PORT}`);
  console.log(`Using Tavily API for web search (no local browser needed)`);
});
