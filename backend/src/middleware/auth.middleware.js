const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/dataSource');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided or invalid format.' 
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user repository and fetch user data
        const userRepository = AppDataSource.getRepository('User');
        const user = await userRepository.findOne({ 
            where: { id: decoded.userId } 
        });

        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid token. User not found.' 
            });
        }

        req.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ 
            error: 'Invalid token.' 
        });
    }
};

module.exports = authMiddleware;