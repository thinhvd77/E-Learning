const { EntitySchema } = require('typeorm');

const VideoSchema = new EntitySchema({
    name: 'Video',
    tableName: 'videos',
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
        filePath: {
            type: 'varchar',
            length: 500,
            nullable: false,
        },
        order: {
            type: 'int',
            nullable: true,
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
        userProgress: {
            type: 'one-to-many',
            target: 'UserVideoProgress',
            inverseSide: 'video',
        },
    },
});

module.exports = VideoSchema;