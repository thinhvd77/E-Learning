const express = require('express');
const progressController = require('../controllers/progress.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/progress/video/:videoId - Authenticated. Update video progress
router.post('/video/:videoId', authMiddleware, progressController.updateVideoProgress);

// GET /api/progress/course/:courseId - Authenticated. Get user's progress for a course
router.get('/course/:courseId', authMiddleware, progressController.getUserProgress);

// POST /api/progress/video/:videoId/complete - Authenticated. Mark video as completed
router.post('/video/:videoId/complete', authMiddleware, progressController.markVideoCompleted);

module.exports = router;