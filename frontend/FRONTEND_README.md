# E-Learning Platform Frontend

A modern React frontend for the E-Learning Platform built with TypeScript.

## Features

### Student Features
- **Authentication**: Register and login functionality
- **Course Browse**: View available courses
- **Video Streaming**: Watch course videos with progress tracking
- **Quiz Taking**: Interactive quizzes with immediate results
- **Progress Tracking**: Monitor learning progress

### Admin Features
- **Course Management**: Create, edit, and delete courses
- **Video Upload**: Upload video content for courses
- **Quiz Creation**: Upload Excel files to create quizzes
- **Dashboard**: Overview of platform statistics

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **CSS3** with modern styling
- **Responsive Design** for mobile and desktop

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Update environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

Create an optimized build:
```bash
npm run build
```

The build files will be in the `build/` directory.

## Project Structure

```
src/
├── components/
│   ├── auth/           # Login and registration
│   ├── student/        # Student dashboard and features
│   ├── admin/          # Admin management interface
│   └── common/         # Shared components
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main app with routing
```

## Key Components

### Authentication
- **Login**: User authentication with role-based routing
- **Register**: New user registration
- **ProtectedRoute**: Route protection based on authentication and roles

### Student Interface
- **StudentDashboard**: Course overview and enrollment
- **CourseDetail**: Course content with videos and quizzes
- **VideoPlayer**: Video streaming with progress tracking
- **QuizPage**: Interactive quiz interface

### Admin Interface
- **AdminDashboard**: Platform statistics and quick actions
- **CreateCourse**: Course creation form
- **ManageCourse**: Course editing and management
- **UploadVideo**: Video file upload for courses
- **UploadQuiz**: Excel-based quiz creation

## API Integration

The frontend communicates with the backend API using Axios with:
- Automatic authentication token handling
- Request/response interceptors
- Error handling and user redirection

## Responsive Design

The interface is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones