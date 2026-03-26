import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chapterRoutes from './routes/chapters.js';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/chapters', chapterRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// Error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = status < 500 ? err.message : 'Internal server error';
  if (status >= 500) console.error(err);
  res.status(status).json({ error: { code: err.code || 'SERVER_ERROR', message } });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
