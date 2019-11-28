'use strict';
module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define('comment', {
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        website: DataTypes.STRING,
        nickname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});
    comment.associate = function(models) {
        // associations can be defined here
    };
    return comment;
};