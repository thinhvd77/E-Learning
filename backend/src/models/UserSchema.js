const { EntitySchema } = require('typeorm');

const UserSchema = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        username: {
            type: 'varchar',
            length: 50,
            unique: true,
            nullable: false,
        },
        passwordHash: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        role: {
            type: 'varchar',
            length: 20,
            nullable: false,
            default: 'student',
        },
        createdAt: {
            type: 'timestamptz',
            createDate: true,
        },
    },
    relations: {
        videoProgress: {
            type: 'one-to-many',
            target: 'UserVideoProgress',
            inverseSide: 'user',
        },
    },
});

module.exports = UserSchema;