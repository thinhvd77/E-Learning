import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Course, Video, Quiz } from '../../types';
import Navbar from '../common/Navbar';
import './Student.css';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        const courseData = await apiService.getCourse(parseInt(id));
        setCourse(courseData);
      } catch (err: any) {
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="loading">Loading course...</div>
        </div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="error-message">{error || 'Course not found'}</div>
          <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="course-detail-header">
          <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
          <h1>{course.title}</h1>
          {course.description && <p className="course-description">{course.description}</p>}
        </div>

        <div className="course-content">
          {/* Videos Section */}
          <div className="content-section">
            <h2>Videos ({course.videos?.length || 0})</h2>
            {course.videos && course.videos.length > 0 ? (
              <div className="content-list">
                {course.videos.map((video: Video) => (
                  <div key={video.id} className="content-item">
                    <div className="content-info">
                      <h3>{video.title}</h3>
                      <span className="content-meta">
                        Added: {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link to={`/videos/${video.id}`} className="content-button">
                      Watch Video
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-content">No videos available in this course yet.</p>
            )}
          </div>

          {/* Quizzes Section */}
          <div className="content-section">
            <h2>Quizzes ({course.quizzes?.length || 0})</h2>
            {course.quizzes && course.quizzes.length > 0 ? (
              <div className="content-list">
                {course.quizzes.map((quiz: Quiz) => (
                  <div key={quiz.id} className="content-item">
                    <div className="content-info">
                      <h3>{quiz.title}</h3>
                      <span className="content-meta">
                        Added: {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link to={`/quizzes/${quiz.id}`} className="content-button">
                      Take Quiz
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-content">No quizzes available in this course yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;