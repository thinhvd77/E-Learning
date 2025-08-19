import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import Navbar from '../common/Navbar';
import './Admin.css';

const UploadQuiz: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId || !file) {
      setError('Please select an Excel file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await apiService.uploadQuiz(parseInt(courseId), file);
      navigate(`/admin/courses/${courseId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload quiz');
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
            <h1>Upload Quiz from Excel</h1>
          </div>

          <div className="upload-instructions">
            <h3>Excel File Format</h3>
            <p>Your Excel file should have the following format:</p>
            <ul>
              <li><strong>Column A:</strong> Question text</li>
              <li><strong>Column B:</strong> Option 1</li>
              <li><strong>Column C:</strong> Option 2</li>
              <li><strong>Column D:</strong> Option 3</li>
              <li><strong>Column E:</strong> Option 4</li>
              <li><strong>Column F:</strong> Correct answer (1, 2, 3, or 4)</li>
            </ul>
            <p><strong>Note:</strong> The first row should contain headers and will be skipped.</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="excel">Excel File *</label>
              <input
                type="file"
                id="excel"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                required
                className="file-input"
              />
              {file && (
                <div className="file-info">
                  <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <Link to={`/admin/courses/${courseId}`} className="cancel-button">
                Cancel
              </Link>
              <button type="submit" disabled={uploading || !file} className="submit-button">
                {uploading ? 'Uploading...' : 'Upload Quiz'}
              </button>
            </div>
          </form>

          <div className="sample-format">
            <h3>Sample Excel Format</h3>
            <table className="format-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Option 1</th>
                  <th>Option 2</th>
                  <th>Option 3</th>
                  <th>Option 4</th>
                  <th>Correct Answer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>What is 2 + 2?</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>What is the capital of France?</td>
                  <td>London</td>
                  <td>Berlin</td>
                  <td>Paris</td>
                  <td>Madrid</td>
                  <td>3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadQuiz;