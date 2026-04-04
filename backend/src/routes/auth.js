import { Router } from 'express';
import { auth } from '../lib/auth.js';
import { toNodeHandler } from 'better-auth/node';

const router = Router();

// Better-Auth handles all auth routes: /signup, /login, /logout, /session
router.all('/*', toNodeHandler(auth));

export default router;
