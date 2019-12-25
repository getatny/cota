const cotaDatabase= require('../../db/models')
const comment = cotaDatabase.comment
const post = cotaDatabase.post
const Op = cotaDatabase.Sequelize.Op

const model = {
    getComments(postId) {
        return comment.findAll({ where: { postId } })
    },
    getMainComments(postId) {
        return comment.findAll({ where: {
            [Op.and]: [
                { postId },
                { parentId: 0 }
            ]
        } })
    },
    getChildComments(postId) {
        return comment.findAll({ where: {
            [Op.and]: [
                { postId },
                { parentId: {
                    [Op.gt]: 0
                } }
            ]
        } })
    },
    createComment(postId, commentContent, email, nickname, website, parentId) {
        return comment.create({ postId, email, nickname, website, parentId, comment: commentContent })
    },
    deleteComments(lists) {
        return comment.destroy({ where: {
            [Op.or]: { id: lists }
        } })
    },
    findPost(key) {
        return post.findOne({ where: { key } })
    },
    findOrCreatePost(key, title, url) {
        return post.findOrCreate({ where: { key }, defaults: { title, url } })
    }
}

module.exports = model