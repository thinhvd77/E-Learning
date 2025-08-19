import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Course } from '../../types';
import Navbar from '../common/Navbar';
import './Admin.css';

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await apiService.getCourses();
        setCourses(coursesData);
      } catch (err: any) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage courses, videos, and quizzes for your e-learning platform</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Courses</h3>
            <div className="stat-number">{courses.length}</div>
          </div>
          <div className="stat-card">
            <h3>Total Videos</h3>
            <div className="stat-number">
              {courses.reduce((total, course) => total + (course.videos?.length || 0), 0)}
            </div>
          </div>
          <div className="stat-card">
            <h3>Total Quizzes</h3>
            <div className="stat-number">
              {courses.reduce((total, course) => total + (course.quizzes?.length || 0), 0)}
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/courses/new" className="action-button primary">
            Create New Course
          </Link>
        </div>

        <div className="recent-courses">
          <h2>Recent Courses</h2>
          {courses.length === 0 ? (
            <div className="empty-state">
              <h3>No courses created yet</h3>
              <p>Start by creating your first course!</p>
              <Link to="/admin/courses/new" className="action-button primary">
                Create Course
              </Link>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.slice(0, 6).map(course => (
                <div key={course.id} className="admin-course-card">
                  <div className="course-header">
                    <h3>{course.title}</h3>
                    <span className="course-date">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {course.description && (
                    <p className="course-description">{course.description}</p>
                  )}
                  <div className="course-stats">
                    <span>Videos: {course.videos?.length || 0}</span>
                    <span>Quizzes: {course.quizzes?.length || 0}</span>
                  </div>
                  <div className="course-actions">
                    <Link to={`/admin/courses/${course.id}`} className="action-button small">
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;