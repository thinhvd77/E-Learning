import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from './utils/auth';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import CourseDetail from './components/student/CourseDetail';
import VideoPlayer from './components/student/VideoPlayer';
import QuizPage from './components/student/QuizPage';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import CreateCourse from './components/admin/CreateCourse';
import ManageCourse from './components/admin/ManageCourse';
import UploadVideo from './components/admin/UploadVideo';
import UploadQuiz from './components/admin/UploadQuiz';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            isAuthenticated() ? (
              <Navigate to={isAdmin() ? "/admin" : "/dashboard"} replace />
            ) : (
              <Login />
            )
          } />
          <Route path="/register" element={
            isAuthenticated() ? (
              <Navigate to={isAdmin() ? "/admin" : "/dashboard"} replace />
            ) : (
              <Register />
            )
          } />

          {/* Student Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/courses/:id" element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          } />
          <Route path="/videos/:id" element={
            <ProtectedRoute>
              <VideoPlayer />
            </ProtectedRoute>
          } />
          <Route path="/quizzes/:id" element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/new" element={
            <ProtectedRoute adminOnly>
              <CreateCourse />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/:id" element={
            <ProtectedRoute adminOnly>
              <ManageCourse />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/:courseId/videos" element={
            <ProtectedRoute adminOnly>
              <UploadVideo />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/:courseId/quizzes" element={
            <ProtectedRoute adminOnly>
              <UploadQuiz />
            </ProtectedRoute>
          } />

          {/* Default Route */}
          <Route path="/" element={
            isAuthenticated() ? (
              <Navigate to={isAdmin() ? "/admin" : "/dashboard"} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* 404 Route */}
          <Route path="*" element={
            <div className="not-found">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
