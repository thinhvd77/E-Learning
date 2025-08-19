# E-Learning Platform Backend

A comprehensive backend application for an internal corporate e-learning platform designed to operate 100% offline within a private Local Area Network (LAN).

## Features

- **User Management**: Admin and Student roles with JWT authentication
- **Course Management**: Create, update, delete courses with video content
- **Video Streaming**: Secure video streaming with Nginx X-Accel-Redirect support
- **Progress Tracking**: Track student learning progress and video completion
- **Quiz System**: Create quizzes by uploading Excel files with automatic grading
- **Reporting**: Generate reports on course progress and quiz results
- **Offline Operation**: Designed for 100% offline operation in private networks

## Technology Stack

- **Runtime**: Node.js v20.x (LTS)
- **Web Framework**: Express.js v4.x
- **Database**: PostgreSQL v16.x
- **ORM**: TypeORM v0.3.x (using JavaScript EntitySchema)
- **Authentication**: JWT with bcryptjs for password hashing
- **File Handling**: Multer for uploads, XLSX for Excel parsing
- **CORS**: Enabled for frontend integration

## Prerequisites

- Node.js v20.x or higher
- PostgreSQL v16.x or higher
- npm or yarn package manager

## Database Setup

1. **Install PostgreSQL v16.x**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # CentOS/RHEL
   sudo yum install postgresql-server postgresql-contrib
   ```

2. **Start PostgreSQL service**
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Create database and user**
   ```bash
   sudo -u postgres psql
   ```
   
   In PostgreSQL prompt:
   ```sql
   CREATE DATABASE elearning;
   CREATE USER elearning_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE elearning TO elearning_user;
   \q
   ```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-Learning/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.template .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=elearning_user
   DB_PASSWORD=your_secure_password
   DB_NAME=elearning

   # Application Configuration
   PORT=3000
   NODE_ENV=development

   # JWT Configuration (generate a strong secret)
   JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here

   # File Upload Configuration
   UPLOAD_PATH=./uploads
   ```

4. **Create uploads directory**
   ```bash
   mkdir -p uploads
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user (public)
- `POST /login` - User login (public)

### Courses (`/api/courses`)
- `GET /` - Get all courses (authenticated)
- `GET /:id` - Get course details with videos (authenticated)
- `POST /` - Create new course (admin only)
- `PUT /:id` - Update course (admin only)
- `DELETE /:id` - Delete course (admin only)

### Videos (`/api/videos`)
- `POST /upload/course/:courseId` - Upload video to course (admin only)
- `GET /stream/:videoId` - Stream video (authenticated)
- `GET /course/:courseId` - Get videos for course (authenticated)

### Progress (`/api/progress`)
- `POST /video/:videoId` - Update video progress (authenticated)
- `GET /course/:courseId` - Get user's course progress (authenticated)
- `POST /video/:videoId/complete` - Mark video as completed (authenticated)

### Quizzes (`/api/quizzes`)
- `POST /upload/course/:courseId` - Upload Excel file to create quiz (admin only)
- `GET /:quizId` - Get quiz questions (authenticated)
- `POST /:quizId/submit` - Submit quiz answers (authenticated)
- `GET /reports/course/:courseId` - Course progress report (admin only)
- `GET /reports/quiz/:quizId` - Quiz results report (admin only)

## Excel Quiz Format

When uploading quizzes via Excel files, use the following column structure:

| Question | OptionA | OptionB | OptionC | OptionD | CorrectOptionIndex |
|----------|---------|---------|---------|---------|-------------------|
| What is 2+2? | 3 | 4 | 5 | 6 | 1 |
| What is the capital of France? | London | Berlin | Paris | Madrid | 2 |

- `CorrectOptionIndex`: 0=OptionA, 1=OptionB, 2=OptionC, 3=OptionD

## Video Streaming with Nginx

For production environments, configure Nginx with X-Accel-Redirect:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /protected_videos/ {
        internal;
        alias /path/to/your/uploads/;
    }
}
```

## Database Schema

The application automatically creates the following tables:

- `users` - User accounts with roles
- `courses` - Course information
- `videos` - Video files linked to courses
- `user_video_progress` - User progress tracking
- `quizzes` - Quiz metadata
- `questions` - Quiz questions and answers

## Security Features

- JWT token-based authentication
- Role-based access control (Admin/Student)
- Password hashing with bcryptjs (salt rounds: 12)
- Secure file upload validation
- CORS configuration
- Environment variable configuration
- Database input validation

## Error Handling

The application includes comprehensive error handling:

- Centralized error middleware
- Database constraint validation
- File upload validation
- Authentication and authorization errors
- Custom error messages for user feedback

## Development

### Project Structure
```
backend/
├── src/
│   ├── api/              # Route definitions
│   ├── controllers/      # Request/Response handling
│   ├── middleware/       # Authentication and error handling
│   ├── models/           # TypeORM EntitySchema definitions
│   ├── services/         # Business logic
│   ├── config/           # Database configuration
│   └── index.js          # Application entry point
├── uploads/              # File upload directory
├── .env.template         # Environment variables template
├── .gitignore
└── package.json
```

### Adding New Features
1. Create entity schema in `src/models/`
2. Add controller logic in `src/controllers/`
3. Create routes in `src/api/`
4. Update main app in `src/index.js`

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### File Upload Issues
- Check `uploads/` directory permissions
- Verify `UPLOAD_PATH` in `.env`
- Check disk space availability

### Authentication Issues
- Verify `JWT_SECRET` is set in `.env`
- Check token format: `Bearer <token>`
- Ensure user exists in database

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Configure Nginx reverse proxy
4. Set up SSL certificates
5. Configure database backups
6. Monitor logs and performance

## License

This project is licensed under the ISC License.