const { EntitySchema } = require('typeorm');

const QuizSchema = new EntitySchema({
    name: 'Quiz',
    tableName: 'quizzes',
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
        courseId: {
            type: 'int',
            nullable: false,
        },
    },
    relations: {
        course: {
            type: 'many-to-one',
            target: 'Course',
            joinColumn: {
                name: 'courseId',
            },
            onDelete: 'CASCADE',
        },
        questions: {
            type: 'one-to-many',
            target: 'Question',
            inverseSide: 'quiz',
        },
    },
});

module.exports = QuizSchema;