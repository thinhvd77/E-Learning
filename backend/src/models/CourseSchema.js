const { EntitySchema } = require('typeorm');

const CourseSchema = new EntitySchema({
    name: 'Course',
    tableName: 'courses',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        title: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        description: {
            type: 'text',
            nullable: true,
        },
        createdAt: {
            type: 'timestamptz',
            createDate: true,
        },
    },
    relations: {
        videos: {
            type: 'one-to-many',
            target: 'Video',
            inverseSide: 'course',
        },
        quizzes: {
            type: 'one-to-many',
            target: 'Quiz',
            inverseSide: 'course',
        },
    },
});

module.exports = CourseSchema;