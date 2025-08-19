const { EntitySchema } = require('typeorm');

const QuestionSchema = new EntitySchema({
    name: 'Question',
    tableName: 'questions',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        questionText: {
            type: 'text',
            nullable: false,
        },
        options: {
            type: 'jsonb',
            nullable: false,
        },
        correctOptionIndex: {
            type: 'int',
            nullable: false,
        },
        quizId: {
            type: 'int',
            nullable: false,
        },
    },
    relations: {
        quiz: {
            type: 'many-to-one',
            target: 'Quiz',
            joinColumn: {
                name: 'quizId',
            },
            onDelete: 'CASCADE',
        },
    },
});

module.exports = QuestionSchema;