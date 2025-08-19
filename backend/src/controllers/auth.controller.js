const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/dataSource');

class AuthController {
    async register(req, res, next) {
        try {
            const { username, password, role = 'student' } = req.body;

            // Validation
            if (!username || !password) {
                return res.status(400).json({
                    error: 'Username and password are required'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password must be at least 6 characters long'
                });
            }

            if (!['student', 'admin'].includes(role)) {
                return res.status(400).json({
                    error: 'Role must be either "student" or "admin"'
                });
            }

            const userRepository = AppDataSource.getRepository('User');

            // Check if user already exists
            const existingUser = await userRepository.findOne({
                where: { username }
            });

            if (existingUser) {
                return res.status(409).json({
                    error: 'Username already exists'
                });
            }

            // Hash password
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // Create user
            const user = userRepository.create({
                username,
                passwordHash,
                role
            });

            const savedUser = await userRepository.save(user);

            // Return user without password
            const { passwordHash: _, ...userResponse } = savedUser;
            res.status(201).json({
                message: 'User created successfully',
                user: userResponse
            });

        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;

            // Validation
            if (!username || !password) {
                return res.status(400).json({
                    error: 'Username and password are required'
                });
            }

            const userRepository = AppDataSource.getRepository('User');

            // Find user
            const user = await userRepository.findOne({
                where: { username }
            });

            if (!user) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.passwordHash);

            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Generate JWT
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    username: user.username, 
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Return user data and token
            const { passwordHash: _, ...userResponse } = user;
            res.json({
                message: 'Login successful',
                token,
                user: userResponse
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();