import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Course } from '../../types';
import Navbar from '../common/Navbar';
import './Student.css';

const StudentDashboard: React.FC = () => {
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
          <div className="loading">Loading courses...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Welcome to Your Learning Dashboard</h1>
          <p>Continue your learning journey with available courses</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="courses-grid">
          {courses.length === 0 ? (
            <div className="empty-state">
              <h3>No courses available yet</h3>
              <p>Check back later for new courses!</p>
            </div>
          ) : (
            courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className="course-date">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {course.description && (
                  <p className="course-description">{course.description}</p>
                )}
                <div className="course-stats">
                  <span>Videos: {course.videos?.length || 0}</span>
                  <span>Quizzes: {course.quizzes?.length || 0}</span>
                </div>
                <Link to={`/courses/${course.id}`} className="course-button">
                  Start Learning
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;