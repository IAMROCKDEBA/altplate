import express from 'express';
import {
  submitPlateChoice,
  getPlateChoices,
  getPlateChoice,
  getPlateChoiceStats,
  generatePlateChoiceReport
} from '../controllers/plateChoiceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', submitPlateChoice);

// Protected routes (Staff only)
router.get('/', protect, authorize('staff'), getPlateChoices);
router.get('/stats/summary', protect, authorize('staff'), getPlateChoiceStats);
router.get('/report', protect, authorize('staff'), generatePlateChoiceReport);
router.get('/:id', protect, authorize('staff'), getPlateChoice);

export default router;
