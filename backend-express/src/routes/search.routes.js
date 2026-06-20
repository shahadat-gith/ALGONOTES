import { Router } from 'express';
import { globalSearch } from '../controllers/search.controllers.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/global', globalSearch);

export default router;
