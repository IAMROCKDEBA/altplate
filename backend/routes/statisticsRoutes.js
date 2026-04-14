import express from 'express';
import { getLandingStats } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/landing', getLandingStats);

export default router;
