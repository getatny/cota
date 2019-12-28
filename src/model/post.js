const cotaDatabase= require('../../db/models')
const post = cotaDatabase.post
const Op = cotaDatabase.Sequelize.Op

const model = {
    findPost(key) {
        return post.findOne({ where: { key } })
    },
    findPosts(page, pageSize) {
        return post.findAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: cotaDatabase.Sequelize.literal('createdAt DESC')
        })
    },
    findOrCreatePost(key, title, url) {
        return post.findOrCreate({ where: { key }, defaults: { title, url } })
    }
}

module.exports = model