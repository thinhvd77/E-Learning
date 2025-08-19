const { EntitySchema } = require('typeorm');

const UserVideoProgressSchema = new EntitySchema({
    name: 'UserVideoProgress',
    tableName: 'user_video_progress',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        progressSeconds: {
            type: 'real',
            default: 0,
        },
        isCompleted: {
            type: 'boolean',
            default: false,
        },
        lastWatchedAt: {
            type: 'timestamptz',
            updateDate: true,
        },
        userId: {
            type: 'int',
            nullable: false,
        },
        videoId: {
            type: 'int',
            nullable: false,
        },
    },
    indices: [
        {
            name: 'IDX_USER_VIDEO_UNIQUE',
            columns: ['userId', 'videoId'],
            unique: true,
        },
    ],
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'userId',
            },
            onDelete: 'CASCADE',
        },
        video: {
            type: 'many-to-one',
            target: 'Video',
            joinColumn: {
                name: 'videoId',
            },
            onDelete: 'CASCADE',
        },
    },
});

module.exports = UserVideoProgressSchema;