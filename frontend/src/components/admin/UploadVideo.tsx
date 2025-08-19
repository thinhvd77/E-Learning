import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import Navbar from '../common/Navbar';
import './Admin.css';

const UploadVideo: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a valid video file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId || !file || !title.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate upload progress (in real implementation, you'd track actual progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      await apiService.uploadVideo(parseInt(courseId), file, title);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        navigate(`/admin/courses/${courseId}`);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload video');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="admin-form-container">
          <div className="form-header">
            <Link to={`/admin/courses/${courseId}`} className="back-button">
              ← Back to Course
            </Link>
            <h1>Upload Video</h1>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="title">Video Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter video title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="video">Video File *</label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleFileChange}
                required
                className="file-input"
              />
              {file && (
                <div className="file-info">
                  <strong>Selected:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{uploadProgress}% uploaded</span>
              </div>
            )}

            <div className="form-actions">
              <Link to={`/admin/courses/${courseId}`} className="cancel-button">
                Cancel
              </Link>
              <button type="submit" disabled={uploading || !file} className="submit-button">
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadVideo;