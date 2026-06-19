import { Router } from 'express';
import { startPromptOptimization, readPromptOptimizationStatus } from '../controllers/prompt.controllers.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.post('/optimize-prompt', startPromptOptimization);
router.get('/optimize-prompt/status/:job_id', readPromptOptimizationStatus);

export default router;