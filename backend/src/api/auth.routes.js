const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/register - Public. Create a new user (default role 'student')
router.post('/register', authController.register);

// POST /api/auth/login - Public. Authenticate user, return a JWT
router.post('/login', authController.login);

module.exports = router;