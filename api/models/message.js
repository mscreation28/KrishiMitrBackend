const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./users');
const Group = require('./channel');

const Message = db.define('Message', {
    messageId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    senderId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'userId',
        }
    },
    groupId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Channel',
            key: 'groupId',
        }
    },
    message: {
        type: Sequelize.TEXT,

    },
    messageDate: {
        type: Sequelize.DATE
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Group.hasMany(Message, {
    onDelete: 'CASCADE',
    foreignKey: 'groupId'
});

User.hasMany(Message, {
    onDelete: 'CASCADE',
    foreignKey: 'senderId'
});

module.exports = Message;