import { Router } from 'express';
import { register, login, verifyUser, forgotPassword } from '../controllers/auth.controllers.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyUser);
router.post('/forgot-password', forgotPassword);

export default router;