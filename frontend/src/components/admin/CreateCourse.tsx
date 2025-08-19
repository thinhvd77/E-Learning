import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import Navbar from '../common/Navbar';
import './Admin.css';

const CreateCourse: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const course = await apiService.createCourse(title, description);
      navigate(`/admin/courses/${course.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="admin-form-container">
          <div className="form-header">
            <Link to="/admin" className="back-button">← Back to Dashboard</Link>
            <h1>Create New Course</h1>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="title">Course Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter course title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Course Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter course description (optional)"
                rows={4}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <Link to="/admin" className="cancel-button">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="submit-button">
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;