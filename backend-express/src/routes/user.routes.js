import { Router } from 'express';
import {
	getCurrentUserDetails,
	getDashboardData,
	updateProfile,
} from '../controllers/user.controllers.js';
import { authenticate } from '../middlewares/auth.js';
import upload from '../config/multer.js';

const router = Router();

router.use(authenticate);

router.get('/me', getCurrentUserDetails);
router.get('/dashboard', getDashboardData);
router.put('/profile', upload.single('file'), updateProfile);

export default router;