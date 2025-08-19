import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import Navbar from '../common/Navbar';
import './Student.css';

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      try {
        // For now, we'll need to get video info from course data
        // In a real app, you'd have a direct video endpoint
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load video');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (!id || !videoRef.current) return;

    const video = videoRef.current;
    const videoId = parseInt(id);

    // Update progress every 5 seconds
    progressIntervalRef.current = setInterval(() => {
      if (video) {
        const watchedSeconds = Math.floor(video.currentTime);
        const completed = video.currentTime >= video.duration * 0.9; // 90% completion

        apiService.updateVideoProgress(videoId, watchedSeconds, completed).catch(console.error);
      }
    }, 5000);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="loading">Loading video...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="error-message">{error}</div>
          <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
        </div>
      </>
    );
  }

  const videoUrl = apiService.getVideoStreamUrl(parseInt(id!));

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="video-player-container">
          <div className="video-header">
            <Link to="/dashboard" className="back-button">← Back to Course</Link>
            <h1>Video Player</h1>
          </div>
          
          <div className="video-wrapper">
            <video
              ref={videoRef}
              controls
              width="100%"
              src={videoUrl}
              onError={() => setError('Failed to load video stream')}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="video-info">
            <p>
              <strong>Note:</strong> Your progress is automatically saved every 5 seconds.
              The video will be marked as completed when you watch 90% of it.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;