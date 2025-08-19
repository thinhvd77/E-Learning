const AppDataSource = require('../config/dataSource');

class ProgressController {
    async updateVideoProgress(req, res, next) {
        try {
            const { videoId } = req.params;
            const { progressSeconds } = req.body;
            const userId = req.user.id;

            // Validation
            if (progressSeconds === undefined || progressSeconds < 0) {
                return res.status(400).json({
                    error: 'Valid progressSeconds is required'
                });
            }

            const videoRepository = AppDataSource.getRepository('Video');
            const progressRepository = AppDataSource.getRepository('UserVideoProgress');

            // Check if video exists
            const video = await videoRepository.findOne({
                where: { id: parseInt(videoId) }
            });

            if (!video) {
                return res.status(404).json({
                    error: 'Video not found'
                });
            }

            // Find existing progress record
            let progress = await progressRepository.findOne({
                where: {
                    userId: userId,
                    videoId: parseInt(videoId)
                }
            });

            if (progress) {
                // Update existing progress
                progress.progressSeconds = progressSeconds;
                progress.lastWatchedAt = new Date();
                
                // Optionally mark as completed based on progress
                // You might want to add video duration tracking to determine completion
                // For now, we'll leave isCompleted as is unless explicitly set
            } else {
                // Create new progress record
                progress = progressRepository.create({
                    userId: userId,
                    videoId: parseInt(videoId),
                    progressSeconds: progressSeconds,
                    isCompleted: false,
                    lastWatchedAt: new Date()
                });
            }

            const savedProgress = await progressRepository.save(progress);

            res.json({
                message: 'Progress updated successfully',
                progress: savedProgress
            });

        } catch (error) {
            next(error);
        }
    }

    async getUserProgress(req, res, next) {
        try {
            const { courseId } = req.params;
            const userId = req.user.id;

            const progressRepository = AppDataSource.getRepository('UserVideoProgress');

            // Get user's progress for all videos in the course
            const progress = await progressRepository
                .createQueryBuilder('progress')
                .innerJoin('progress.video', 'video')
                .where('video.courseId = :courseId', { courseId: parseInt(courseId) })
                .andWhere('progress.userId = :userId', { userId })
                .getMany();

            res.json({
                message: 'Progress retrieved successfully',
                progress
            });

        } catch (error) {
            next(error);
        }
    }

    async markVideoCompleted(req, res, next) {
        try {
            const { videoId } = req.params;
            const userId = req.user.id;

            const videoRepository = AppDataSource.getRepository('Video');
            const progressRepository = AppDataSource.getRepository('UserVideoProgress');

            // Check if video exists
            const video = await videoRepository.findOne({
                where: { id: parseInt(videoId) }
            });

            if (!video) {
                return res.status(404).json({
                    error: 'Video not found'
                });
            }

            // Find or create progress record
            let progress = await progressRepository.findOne({
                where: {
                    userId: userId,
                    videoId: parseInt(videoId)
                }
            });

            if (!progress) {
                progress = progressRepository.create({
                    userId: userId,
                    videoId: parseInt(videoId),
                    progressSeconds: 0,
                    isCompleted: true,
                    lastWatchedAt: new Date()
                });
            } else {
                progress.isCompleted = true;
                progress.lastWatchedAt = new Date();
            }

            const savedProgress = await progressRepository.save(progress);

            res.json({
                message: 'Video marked as completed',
                progress: savedProgress
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProgressController();