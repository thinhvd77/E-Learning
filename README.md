# E-Learning Platform

A comprehensive internal corporate e-learning platform designed to operate **100% offline within a private Local Area Network (LAN)**.

## Architecture

This platform consists of:

### Backend (`/backend/`)
- **Node.js v20.x** with **Express.js v4.x**
- **PostgreSQL v16.x** with **TypeORM v0.3.x** (JavaScript EntitySchema)
- JWT authentication with role-based access control
- Secure video streaming with Nginx X-Accel-Redirect support
- Excel-based quiz creation and automated grading
- Progress tracking and comprehensive reporting

### Features

- **User Management**: Admin and Student roles with secure authentication
- **Course Management**: Create, update, delete courses with video content
- **Video Streaming**: Optimized video delivery for offline networks
- **Progress Tracking**: Track student learning progress and completion
- **Quiz System**: Upload Excel files to create quizzes with automatic grading
- **Reporting**: Generate detailed reports on course progress and quiz results
- **Offline Operation**: Designed for 100% offline operation in private networks

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.template .env
   # Edit .env with your database configuration
   ```

4. Set up PostgreSQL database (see backend/README.md for details)

5. Start the server:
   ```bash
   npm start
   ```

For detailed setup instructions, see [`backend/README.md`](backend/README.md).

## API Documentation

The backend provides RESTful APIs for:

- **Authentication**: `/api/auth` - User registration and login
- **Courses**: `/api/courses` - Course management and retrieval
- **Videos**: `/api/videos` - Video upload and streaming
- **Progress**: `/api/progress` - Learning progress tracking
- **Quizzes**: `/api/quizzes` - Quiz creation, taking, and reporting

## Technology Stack

- **Backend**: Node.js, Express.js, TypeORM, PostgreSQL
- **Authentication**: JWT tokens with bcryptjs password hashing
- **File Handling**: Multer for uploads, XLSX for Excel parsing
- **Database**: PostgreSQL with comprehensive schema design
- **Security**: Role-based access control, secure file uploads

## License

This project is licensed under the ISC License.