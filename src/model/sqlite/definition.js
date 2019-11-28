const Sequelize = require('sequelize')
const Model = Sequelize.Model

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/cota.sqlite'
})

class Comment extends Model {}
class Post extends Model {}

Comment.init({
    parentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    website: Sequelize.STRING,
    nickname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'comment' })

Post.init({
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, { sequelize, modelName: 'post' })

Post.hasMany(Comment)

sequelize.authenticate().then(() => {
    console.info('Connect to Cota sqlite successfully.');
}).catch(err => {
    console.error('Connect to Cota sqlite failed: ', err);
})

module.exports = {
    Post,
    Comment
}