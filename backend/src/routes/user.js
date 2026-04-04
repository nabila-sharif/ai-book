import { Router } from 'express';
import pg from 'pg';
import { requireAuth } from '../middleware/requireAuth.js';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const router = Router();

// GET /api/user/profile
router.get('/profile', requireAuth, (req, res) => {
  const { id, email, name, level, createdAt } = req.user;
  res.json({ id, email, name, level: level || 'intermediate', createdAt });
});

// PATCH /api/user/level
router.patch('/level', requireAuth, async (req, res, next) => {
  const { level } = req.body;
  if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
    return res.status(400).json({ error: { code: 'INVALID_LEVEL', message: 'Level must be beginner, intermediate, or advanced' } });
  }
  try {
    await pool.query('UPDATE "user" SET level=$1, "updatedAt"=NOW() WHERE id=$2', [level, req.user.id]);
    res.json({ id: req.user.id, email: req.user.email, level });
  } catch (err) {
    next(err);
  }
});

export default router;
