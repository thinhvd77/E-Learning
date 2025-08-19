const express = require('express');
const multer = require('multer');
const path = require('path');
const videoController = require('../controllers/video.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_PATH || './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept video files
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    }
});

// POST /api/videos/upload/course/:courseId - Admin only. Upload a video file for a specific course
router.post('/upload/course/:courseId', 
    authMiddleware, 
    adminMiddleware, 
    upload.single('video'), 
    videoController.uploadVideo
);

// GET /api/videos/stream/:videoId - Authenticated. Stream video with X-Accel-Redirect
router.get('/stream/:videoId', authMiddleware, videoController.streamVideo);

// GET /api/videos/course/:courseId - Get videos for a course (helper endpoint)
router.get('/course/:courseId', authMiddleware, videoController.getVideosByCount);

module.exports = router;