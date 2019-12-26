const cotaDatabase= require('../../db/models')
const comment = cotaDatabase.comment
const post = cotaDatabase.post
const Op = cotaDatabase.Sequelize.Op

const model = {
    getComments(postId, page, pageSize) {
        return comment.findAll({ 
            where: { postId }, 
            order: cotaDatabase.Sequelize.literal('createdAt DESC')
        })
    },
    getMainComments(postId, page, pageSize) {
        return comment.findAndCountAll({ 
            where: {
                [Op.and]: [
                    { postId },
                    { parentId: 0 }
                ]
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: cotaDatabase.Sequelize.literal('createdAt DESC')
        })
    },
    getChildComments(postId, parentIds) {
        return comment.findAll({ where: {
            [Op.and]: [
                { postId },
                { rootId: {
                    [Op.and]: {
                        [Op.gt]: 0,
                        [Op.or]: parentIds
                    }
                } }
            ]
        } })
    },
    createComment(postId, commentContent, email, nickname, website, rootId, parentId) {
        return comment.create({ postId, email, nickname, website, parentId, comment: commentContent, rootId })
    },
    deleteComments(lists) {
        return comment.destroy({ where: {
            [Op.or]: { id: lists }
        } })
    },
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