const express = require('express');
const multer = require('multer');
const quizController = require('../controllers/quiz.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// Configure multer for Excel file uploads
const upload = multer({
    storage: multer.memoryStorage(), // Store in memory for processing
    fileFilter: (req, file, cb) => {
        // Accept Excel files
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files (.xlsx, .xls) are allowed!'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for Excel files
    }
});

// POST /api/quizzes/upload/course/:courseId - Admin only. Upload Excel file to create quiz
router.post('/upload/course/:courseId', 
    authMiddleware, 
    adminMiddleware, 
    upload.single('excel'), 
    quizController.uploadQuiz
);

// GET /api/quizzes/:quizId - Authenticated. Get quiz details and questions (without correct answers)
router.get('/:quizId', authMiddleware, quizController.getQuiz);

// POST /api/quizzes/:quizId/submit - Authenticated. Submit quiz answers for grading
router.post('/:quizId/submit', authMiddleware, quizController.submitQuiz);

// GET /api/quizzes/reports/course/:courseId - Admin only. Generate course progress report
router.get('/reports/course/:courseId', authMiddleware, adminMiddleware, quizController.getCourseReport);

// GET /api/quizzes/reports/quiz/:quizId - Admin only. Generate quiz results report
router.get('/reports/quiz/:quizId', authMiddleware, adminMiddleware, quizController.getQuizReport);

module.exports = router;