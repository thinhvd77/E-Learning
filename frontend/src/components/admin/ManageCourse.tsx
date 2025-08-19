import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Course } from '../../types';
import Navbar from '../common/Navbar';
import './Admin.css';

const ManageCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        const courseData = await apiService.getCourse(parseInt(id));
        setCourse(courseData);
        setTitle(courseData.title);
        setDescription(courseData.description || '');
      } catch (err: any) {
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !course) return;

    setSaving(true);
    setError('');

    try {
      const updatedCourse = await apiService.updateCourse(parseInt(id), title, description);
      setCourse(updatedCourse);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !course) return;

    if (!window.confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteCourse(parseInt(id));
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete course');
    }
  };

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

  if (error && !course) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="error-message">{error}</div>
          <Link to="/admin" className="back-button">Back to Dashboard</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="admin-course-detail">
          <div className="course-detail-header">
            <Link to="/admin" className="back-button">← Back to Dashboard</Link>
            <div className="header-actions">
              <button
                onClick={() => setEditing(!editing)}
                className="action-button secondary"
              >
                {editing ? 'Cancel Edit' : 'Edit Course'}
              </button>
              <button
                onClick={handleDelete}
                className="action-button danger"
              >
                Delete Course
              </button>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="admin-form">
              <div className="form-group">
                <label htmlFor="title">Course Title *</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Course Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="submit-button">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="course-info">
              <h1>{course?.title}</h1>
              {course?.description && <p className="course-description">{course.description}</p>}
              <div className="course-meta">
                <span>Created: {course && new Date(course.createdAt).toLocaleDateString()}</span>
                <span>Videos: {course?.videos?.length || 0}</span>
                <span>Quizzes: {course?.quizzes?.length || 0}</span>
              </div>
            </div>
          )}

          <div className="course-management">
            <div className="management-section">
              <h2>Content Management</h2>
              <div className="management-actions">
                <Link
                  to={`/admin/courses/${id}/videos`}
                  className="action-button primary"
                >
                  Upload Video
                </Link>
                <Link
                  to={`/admin/courses/${id}/quizzes`}
                  className="action-button primary"
                >
                  Upload Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageCourse;