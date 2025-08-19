const AppDataSource = require('../config/dataSource');
const quizService = require('../services/quiz.service');

class QuizController {
    async uploadQuiz(req, res, next) {
        try {
            const { courseId } = req.params;
            const { title } = req.body;

            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    error: 'No Excel file uploaded'
                });
            }

            // Validation
            if (!title) {
                return res.status(400).json({
                    error: 'Quiz title is required'
                });
            }

            const courseRepository = AppDataSource.getRepository('Course');

            // Check if course exists
            const course = await courseRepository.findOne({
                where: { id: parseInt(courseId) }
            });

            if (!course) {
                return res.status(404).json({
                    error: 'Course not found'
                });
            }

            // Parse Excel file
            const questions = quizService.parseExcelFile(req.file.buffer);

            // Start database transaction
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const quizRepository = queryRunner.manager.getRepository('Quiz');
                const questionRepository = queryRunner.manager.getRepository('Question');

                // Create quiz
                const quiz = quizRepository.create({
                    title,
                    courseId: parseInt(courseId)
                });

                const savedQuiz = await quizRepository.save(quiz);

                // Create questions
                const questionEntities = questions.map(q => 
                    questionRepository.create({
                        questionText: q.questionText,
                        options: q.options,
                        correctOptionIndex: q.correctOptionIndex,
                        quizId: savedQuiz.id
                    })
                );

                await questionRepository.save(questionEntities);

                // Commit transaction
                await queryRunner.commitTransaction();

                res.status(201).json({
                    message: 'Quiz created successfully',
                    quiz: {
                        ...savedQuiz,
                        questionCount: questions.length
                    }
                });

            } catch (error) {
                // Rollback transaction on error
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                await queryRunner.release();
            }

        } catch (error) {
            next(error);
        }
    }

    async getQuiz(req, res, next) {
        try {
            const { quizId } = req.params;
            const quizRepository = AppDataSource.getRepository('Quiz');

            const quiz = await quizRepository.findOne({
                where: { id: parseInt(quizId) },
                relations: ['questions']
            });

            if (!quiz) {
                return res.status(404).json({
                    error: 'Quiz not found'
                });
            }

            // Remove correct answers from questions for students
            const sanitizedQuestions = quiz.questions.map(q => ({
                id: q.id,
                questionText: q.questionText,
                options: q.options
                // correctOptionIndex is omitted
            }));

            res.json({
                message: 'Quiz retrieved successfully',
                quiz: {
                    ...quiz,
                    questions: sanitizedQuestions
                }
            });

        } catch (error) {
            next(error);
        }
    }

    async submitQuiz(req, res, next) {
        try {
            const { quizId } = req.params;
            const { answers } = req.body;
            const userId = req.user.id;

            // Validation
            if (!answers || !Array.isArray(answers)) {
                return res.status(400).json({
                    error: 'Answers array is required'
                });
            }

            const quizRepository = AppDataSource.getRepository('Quiz');

            const quiz = await quizRepository.findOne({
                where: { id: parseInt(quizId) },
                relations: ['questions']
            });

            if (!quiz) {
                return res.status(404).json({
                    error: 'Quiz not found'
                });
            }

            // Calculate score
            const result = quizService.calculateQuizScore(quiz.questions, answers);

            // Here you might want to save the quiz result to a separate table
            // For now, we'll just return the result

            res.json({
                message: 'Quiz submitted successfully',
                result: {
                    quizId: quiz.id,
                    userId,
                    submittedAt: new Date(),
                    ...result
                }
            });

        } catch (error) {
            next(error);
        }
    }

    async getCourseReport(req, res, next) {
        try {
            const { courseId } = req.params;

            const progressRepository = AppDataSource.getRepository('UserVideoProgress');
            const userRepository = AppDataSource.getRepository('User');
            const videoRepository = AppDataSource.getRepository('Video');

            // Get all videos in the course
            const videos = await videoRepository.find({
                where: { courseId: parseInt(courseId) }
            });

            // Get all students (non-admin users)
            const students = await userRepository.find({
                where: { role: 'student' }
            });

            // Get progress for all students in this course
            const progressData = await progressRepository
                .createQueryBuilder('progress')
                .innerJoin('progress.video', 'video')
                .innerJoin('progress.user', 'user')
                .where('video.courseId = :courseId', { courseId: parseInt(courseId) })
                .select([
                    'progress.userId',
                    'progress.videoId',
                    'progress.progressSeconds',
                    'progress.isCompleted',
                    'progress.lastWatchedAt',
                    'user.username',
                    'video.title'
                ])
                .getMany();

            // Format report data
            const report = students.map(student => {
                const studentProgress = progressData.filter(p => p.userId === student.id);
                const completedVideos = studentProgress.filter(p => p.isCompleted).length;
                const totalVideos = videos.length;
                const completionRate = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

                return {
                    student: {
                        id: student.id,
                        username: student.username
                    },
                    completedVideos,
                    totalVideos,
                    completionRate: Math.round(completionRate * 100) / 100,
                    lastActivity: studentProgress.length > 0 
                        ? Math.max(...studentProgress.map(p => new Date(p.lastWatchedAt).getTime()))
                        : null
                };
            });

            res.json({
                message: 'Course report generated successfully',
                courseId: parseInt(courseId),
                generatedAt: new Date(),
                report
            });

        } catch (error) {
            next(error);
        }
    }

    async getQuizReport(req, res, next) {
        try {
            const { quizId } = req.params;

            // For now, return a placeholder as we haven't implemented quiz results storage
            res.json({
                message: 'Quiz report generated successfully',
                quizId: parseInt(quizId),
                generatedAt: new Date(),
                note: 'Quiz results storage not implemented yet. This would contain student submissions and scores.'
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new QuizController();