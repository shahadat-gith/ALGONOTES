import { Router } from 'express';
import { 
  generateAiTheory, 
  checkTheoryGenerationStatus, 
  uploadTheoryImage, 
  deleteTheoryImage, 
  getAllTheoriesByUser, 
  getTheoryById, 
  updateTheory, 
  deleteTheory 
} from '../controllers/theory.controllers.js';
import { authenticate } from '../middlewares/auth.js';
import upload from '../config/multer.js';

const router = Router();

router.use(authenticate);

router.post('/generate', generateAiTheory);
router.get('/status/:theory_id', checkTheoryGenerationStatus);
router.post('/:theory_id/upload-image', upload.single('file'), uploadTheoryImage);
router.post('/:theory_id/delete-image', deleteTheoryImage);
router.get('/user', getAllTheoriesByUser);
router.get('/:theory_id', getTheoryById);
router.put('/:theory_id', updateTheory);
router.delete('/:theory_id', deleteTheory);

export default router;