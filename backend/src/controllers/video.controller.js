const path = require('path');
const AppDataSource = require('../config/dataSource');

class VideoController {
    async uploadVideo(req, res, next) {
        try {
            const { courseId } = req.params;
            const { title, order } = req.body;

            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    error: 'No video file uploaded'
                });
            }

            // Validation
            if (!title) {
                return res.status(400).json({
                    error: 'Title is required'
                });
            }

            const courseRepository = AppDataSource.getRepository('Course');
            const videoRepository = AppDataSource.getRepository('Video');

            // Check if course exists
            const course = await courseRepository.findOne({
                where: { id: parseInt(courseId) }
            });

            if (!course) {
                return res.status(404).json({
                    error: 'Course not found'
                });
            }

            // Create video record
            const video = videoRepository.create({
                title,
                filePath: req.file.path,
                order: order ? parseInt(order) : null,
                courseId: parseInt(courseId)
            });

            const savedVideo = await videoRepository.save(video);

            res.status(201).json({
                message: 'Video uploaded successfully',
                video: savedVideo
            });

        } catch (error) {
            next(error);
        }
    }

    async streamVideo(req, res, next) {
        try {
            const { videoId } = req.params;
            const videoRepository = AppDataSource.getRepository('Video');

            const video = await videoRepository.findOne({
                where: { id: parseInt(videoId) }
            });

            if (!video) {
                return res.status(404).json({
                    error: 'Video not found'
                });
            }

            // Use X-Accel-Redirect for Nginx to handle file serving
            // The actual file path will be handled by Nginx internal location
            const fileName = path.basename(video.filePath);
            
            // Set headers for Nginx X-Accel-Redirect
            res.set({
                'X-Accel-Redirect': `/protected_videos/${fileName}`,
                'Content-Type': 'video/mp4',
                'Cache-Control': 'private, max-age=3600'
            });

            // Send 200 OK response - Nginx will handle the actual file serving
            res.status(200).end();

        } catch (error) {
            next(error);
        }
    }

    async getVideosByCount(req, res, next) {
        try {
            const { courseId } = req.params;
            const videoRepository = AppDataSource.getRepository('Video');

            const videos = await videoRepository.find({
                where: { courseId: parseInt(courseId) },
                order: { order: 'ASC' }
            });

            res.json({
                message: 'Videos retrieved successfully',
                videos
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VideoController();