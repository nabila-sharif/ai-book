import { Router } from 'express';
import { listChapters, getChapter } from '../services/chapters.js';

const router = Router();

// GET /api/chapters
router.get('/', async (_req, res, next) => {
  try {
    const chapters = await listChapters();
    res.json({ chapters });
  } catch (err) {
    next(err);
  }
});

// GET /api/chapters/:id?level=beginner|intermediate|advanced
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const level = req.query.level || 'intermediate';
    const chapter = await getChapter(id, level);
    res.json(chapter);
  } catch (err) {
    next(err);
  }
});

export default router;
