require('reflect-metadata');
const { DataSource } = require('typeorm');

// Import all entity schemas
const UserSchema = require('../models/UserSchema');
const CourseSchema = require('../models/CourseSchema');
const VideoSchema = require('../models/VideoSchema');
const UserVideoProgressSchema = require('../models/UserVideoProgressSchema');
const QuizSchema = require('../models/QuizSchema');
const QuestionSchema = require('../models/QuestionSchema');

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elearning',
    synchronize: process.env.NODE_ENV === 'development', // Only sync in development
    logging: process.env.NODE_ENV === 'development',
    entities: [
        UserSchema,
        CourseSchema,
        VideoSchema,
        UserVideoProgressSchema,
        QuizSchema,
        QuestionSchema,
    ],
});

module.exports = AppDataSource;