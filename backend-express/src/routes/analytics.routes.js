import { Router } from 'express';

import {
  getAnalyticsStats,
  registerPageVisit,
} from '../controllers/analytics.controllers.js';


const router = Router();

router.post('/visits', registerPageVisit);
router.get('/stats', getAnalyticsStats);

export default router;