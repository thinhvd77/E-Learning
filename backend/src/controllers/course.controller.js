const AppDataSource = require('../config/dataSource');

class CourseController {
    async getAllCourses(req, res, next) {
        try {
            const courseRepository = AppDataSource.getRepository('Course');
            
            const courses = await courseRepository.find({
                order: { createdAt: 'DESC' }
            });

            res.json({
                message: 'Courses retrieved successfully',
                courses
            });

        } catch (error) {
            next(error);
        }
    }

    async getCourseById(req, res, next) {
        try {
            const { id } = req.params;
            const courseRepository = AppDataSource.getRepository('Course');

            const course = await courseRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['videos']
            });

            if (!course) {
                return res.status(404).json({
                    error: 'Course not found'
                });
            }

            // Sort videos by order
            if (course.videos) {
                course.videos.sort((a, b) => (a.order || 0) - (b.order || 0));
            }

            res.json({
                message: 'Course retrieved successfully',
                course
            });

        } catch (error) {
            next(error);
        }
    }

    async createCourse(req, res, next) {
        try {
            const { title, description } = req.body;

            // Validation
            if (!title) {
                return res.status(400).json({
                    error: 'Title is required'
                });
            }

            const courseRepository = AppDataSource.getRepository('Course');

            const course = courseRepository.create({
                title,
                description
            });

            const savedCourse = await courseRepository.save(course);

            res.status(201).json({
                message: 'Course created successfully',
                course: savedCourse
            });

        } catch (error) {
            next(error);
        }
    }

    async updateCourse(req, res, next) {
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            // Validation
            if (!title) {
                return res.status(400).json({
                    error: 'Title is required'
                });
            }

            const courseRepository = AppDataSource.getRepository('Course');

            const course = await courseRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!course) {
                return res.status(404).json({
                    error: 'Course not found'
                });
            }

            // Update course
            course.title = title;
            course.description = description;

            const updatedCourse = await courseRepository.save(course);

            res.json({
                message: 'Course updated successfully',
                course: updatedCourse
            });

        } catch (error) {
            next(error);
        }
    }

    async deleteCourse(req, res, next) {
        try {
            const { id } = req.params;
            const courseRepository = AppDataSource.getRepository('Course');

            const course = await courseRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!course) {
                return res.status(404).json({
                    error: 'Course not found'
                });
            }

            await courseRepository.remove(course);

            res.json({
                message: 'Course deleted successfully'
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CourseController();