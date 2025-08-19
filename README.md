# E-Learning Platform

A complete e-learning platform with a Node.js backend and React frontend, designed for corporate training and online education.

## Overview

This platform provides a comprehensive solution for online learning with separate interfaces for students and administrators. Students can browse courses, watch videos, take quizzes, and track their progress. Administrators can manage courses, upload content, and monitor student performance.

## Architecture

- **Backend**: Node.js with Express, TypeORM, and PostgreSQL
- **Frontend**: React 18 with TypeScript and React Router
- **Database**: PostgreSQL with TypeORM entities
- **Authentication**: JWT-based authentication with role management

## Features

### Student Features
- User registration and login
- Browse available courses
- Stream video content with progress tracking
- Take interactive quizzes
- View learning progress and completion status

### Admin Features
- Complete course management (CRUD operations)
- Video upload and management
- Quiz creation via Excel file upload
- Student progress monitoring
- Platform statistics dashboard

### Technical Features
- Responsive design for all devices
- Video streaming with progress tracking
- Excel-based quiz import system
- Role-based access control
- RESTful API architecture
- Modern React with TypeScript

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.template .env
```

4. Configure database in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=elearning_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

5. Start the backend:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Videos
- `POST /api/videos/upload/course/:courseId` - Upload video (Admin)
- `GET /api/videos/stream/:videoId` - Stream video
- `GET /api/videos/course/:courseId` - Get course videos

### Quizzes
- `POST /api/quizzes/upload/course/:courseId` - Upload quiz from Excel (Admin)
- `GET /api/quizzes/:quizId` - Get quiz questions
- `POST /api/quizzes/:quizId/submit` - Submit quiz answers

### Progress
- `POST /api/progress/video` - Update video progress
- `GET /api/progress/user` - Get user progress

## Database Schema

### Users
- Basic user information with role-based access
- Supports 'student' and 'admin' roles

### Courses
- Course metadata with title and description
- One-to-many relationships with videos and quizzes

### Videos
- Video file storage with course association
- Progress tracking per user

### Quizzes & Questions
- Multiple choice questions with correct answers
- Excel import functionality for bulk question creation

### Progress Tracking
- Video watch progress with completion status
- Quiz scores and submission tracking

## Excel Quiz Format

For quiz creation, use the following Excel format:

| Question | Option 1 | Option 2 | Option 3 | Option 4 | Correct Answer |
|----------|----------|----------|----------|----------|----------------|
| What is 2+2? | 3 | 4 | 5 | 6 | 2 |
| Capital of France? | London | Berlin | Paris | Madrid | 3 |

- Column A: Question text
- Columns B-E: Answer options
- Column F: Correct answer number (1-4)

## Production Deployment

### Backend Deployment
1. Build and configure for production environment
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy to your hosting platform

### Frontend Deployment
1. Build the React app:
```bash
npm run build
```
2. Serve the built files with a web server
3. Configure API URL for production

## Security Features

- JWT token-based authentication
- Role-based access control
- File upload validation
- CORS configuration
- SQL injection protection via TypeORM

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository. Platform

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