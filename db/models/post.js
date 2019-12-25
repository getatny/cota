'use strict';
module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});
    post.associate = function(models) {
        post.hasMany(models.comment)
    };
    return post;
};