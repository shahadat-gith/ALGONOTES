import { Router } from 'express';
import { 
  generateAiNote, 
  checkNoteGenerationStatus, 
  getAllNotesByUser, 
  getNoteByNoteId, 
  updateNote, 
  deleteNote 
} from '../controllers/note.controllers.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Secure all endpoints under /notes paths
router.use(authenticate);

router.post('/generate', generateAiNote);
router.get('/status/:note_id', checkNoteGenerationStatus);
router.get('/user', getAllNotesByUser);
router.get('/:note_id', getNoteByNoteId);
router.put('/:note_id', updateNote);
router.delete('/:note_id', deleteNote);

export default router;