const express = require('express');
const courseController = require('../controllers/course.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// GET /api/courses - Authenticated (Student, Admin). Get a list of all courses
router.get('/', authMiddleware, courseController.getAllCourses);

// GET /api/courses/:id - Authenticated. Get details of a single course, including its list of videos
router.get('/:id', authMiddleware, courseController.getCourseById);

// POST /api/courses - Admin only. Create a new course
router.post('/', authMiddleware, adminMiddleware, courseController.createCourse);

// PUT /api/courses/:id - Admin only. Update a course's details
router.put('/:id', authMiddleware, adminMiddleware, courseController.updateCourse);

// DELETE /api/courses/:id - Admin only. Delete a course
router.delete('/:id', authMiddleware, adminMiddleware, courseController.deleteCourse);

module.exports = router;