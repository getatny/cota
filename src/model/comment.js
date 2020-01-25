const cotaDatabase= require('../../db/models')
const comment = cotaDatabase.comment
const Op = cotaDatabase.Sequelize.Op

const model = {
    getAllCommentsWithSpecificPostId(postId, page, pageSize) {
        return comment.findAndCountAll({ 
            where: { postId },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: cotaDatabase.Sequelize.literal('createdAt DESC')
        })
    },
    getComments(options) {
        return comment.findAndCountAll({
            order: cotaDatabase.Sequelize.literal('createdAt DESC'),
            ...options
        })
    },
    getComment(id) {
        return comment.findByPk(id)
    },
    findCommentsByUserEmail(options) {
        return comment.findAndCountAll({
            order: cotaDatabase.Sequelize.literal('createdAt DESC'),
            ...options
        })
    },
    getMainComments(postId, page, pageSize, email = null) {
        return comment.findAndCountAll({
            where: email ? {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { postId },
                            { parentId: 0 },
                            { status: 1 }
                        ]
                    },
                    {
                        [Op.and]: [
                            { postId },
                            { parentId: 0 },
                            { status: 0 },
                            { email }
                        ]
                    }
                ]
            } : {
                [Op.and]: [
                    { postId },
                    { parentId: 0 },
                    { status: 1 }
                ]
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: cotaDatabase.Sequelize.literal('createdAt DESC')
        })
    },
    getChildComments(postId, parentIds, email = null) {
        return comment.findAll({ where: email ? {
            [Op.or]: [
                {
                    [Op.and]: [
                        { postId },
                        { rootId: {
                            [Op.and]: {
                                [Op.gt]: 0,
                                [Op.or]: parentIds
                            }
                        } },
                        { status: 1 }
                    ]
                },
                {
                    [Op.and]: [
                        { postId },
                        { rootId: {
                            [Op.and]: {
                                [Op.gt]: 0,
                                [Op.or]: parentIds
                            }
                        } },
                        { status: 0 },
                        { email }
                    ]
                }
            ]
        } : {
            [Op.and]: [
                { postId },
                { rootId: {
                    [Op.and]: {
                        [Op.gt]: 0,
                        [Op.or]: parentIds
                    }
                } },
                { status: 1 }
            ]
        } })
    },
    createComment(postId, commentContent, email, nickname, website, rootId, parentId, notify) {
        return comment.create({ postId, email, nickname, website, parentId, comment: commentContent, rootId, notify })
    },
    deleteComments(lists) {
        return comment.destroy({ where: {
            [Op.or]: { id: lists }
        } })
    },
    updateCommentStatus(commentId) {
        return comment.update({ status: 1 }, { where: { id: commentId } })
    },
    countComments(where) {
        return comment.count({ where, paranoid: true })
    }
}

module.exports = model
