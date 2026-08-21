import { Router } from 'express';
import { analyzeUserProfile, getRepoDetail, getHealth } from '../controllers/analyzerController.js';
import { apiLimiter, strictLimiter } from '../utils/rateLimiter.js';

const router = Router();

// Health check endpoint
router.get('/health', getHealth);

// Analyze GitHub user profile
router.get('/analyze/:username', apiLimiter, analyzeUserProfile);

// Repository deep detail preview
router.get('/repos/:username/:repo', strictLimiter, getRepoDetail);

export default router;
