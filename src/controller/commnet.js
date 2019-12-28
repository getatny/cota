const dbController = require('../model').comment
const { errorResolver } = require('./utils')

const controller = {
    createComment: async (ctx, next) => {
        const { key, commentContent, email, nickname, website, parentId, title, url, rootId } = ctx.request.body

        await errorResolver(async () => {
            const [ post ] = await dbController.findOrCreatePost(key, title, url)
            const comment = await dbController.createComment(post.id, commentContent, email, nickname, website, rootId, parentId)

            ctx.body = {
                success: true,
                data: comment
            }
        }, ctx)

        return next()
    },
    getComments: async (ctx, next) => {
        const { key, page = 1, pageSize = 15 } = ctx.params
        
        await errorResolver(async () => {
            const post = await dbController.findPost(key)
            if (post) {
                const { count, rows: mainComments } = await dbController.getMainComments(post.id, parseInt(page), parseInt(pageSize))
                const mainCommentsIds = mainComments.map(comment => comment.id)
                const childComments = await dbController.getChildComments(post.id, mainCommentsIds)

                ctx.body = {
                    success: true,
                    data: {
                        mainComments,
                        childComments
                    },
                    count
                }
            } else {
                ctx.body = {
                    success: true,
                    data: {
                        mainComments: [],
                        childComments: []
                    }
                }
            }
        }, ctx)

        return next()
    },
    deleteComments: async (ctx, next) => {
        const { lists } = ctx.request.body

        await errorResolver(async () => {
            const affectedCount = await dbController.deleteComments(lists)

            ctx.body = {
                success: true,
                affectedCount
            }
        }, ctx)

        return next()
    }
}

module.exports = controller