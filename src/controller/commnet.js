const dbController = require('../model')
const { errorResolver } = require('./resolver')
const config = require('../config')

const controller = {
    createComment: async (ctx, next) => {
        const { key, commentContent, email, nickname, website, parentId, title, url, rootId } = ctx.request.body

        await errorResolver(async () => {
            const [ post ] = await dbController.findOrCreatePost(key, title, url)
            const comment = await dbController.createComment(post.id, commentContent, email, nickname, website, rootId, parentId)

            ctx.send(comment)
        }, ctx)

        return next()
    },
    getComments: async (ctx, next) => {
        const { key, page = 1, pageSize = 15 } = ctx.params
        const { email = null } = ctx.request.query
        
        await errorResolver(async () => {
            const post = await dbController.findPost(key)
            if (post) {
                const { count, rows: mainComments } = await dbController.getMainComments(post.id, parseInt(page), parseInt(pageSize), email)
                const mainCommentsIds = mainComments.map(comment => comment.id)
                const childComments = await dbController.getChildComments(post.id, mainCommentsIds, email)

                ctx.send({
                    comments: {
                        mainComments,
                        childComments
                    },
                    count
                })
            } else {
                ctx.send({
                    comments: {
                        mainComments: [],
                        childComments: []
                    },
                    count: 0
                })
            }
        }, ctx)

        return next()
    },
    deleteComments: async (ctx, next) => {
        const { lists } = ctx.request.body

        await errorResolver(async () => {
            const affectedCount = await dbController.deleteComments(lists)
            ctx.send(affectedCount)
        }, ctx)

        return next()
    },
    approveComment: async (ctx, next) => {
        const { commentId } = ctx.params
        const { email } = ctx.request.body

        await errorResolver(async () => {
            await dbController.updateCommentStatus(commentId)
            
            if (config.admin.trustThreshhold !== 0) {
                const approvedCommentsCount = dbController.countComments({ email, status: 1 })

                if (approvedCommentsCount === config.admin.trustThreshhold) {
                    dbController.createUser({ email }) // add current user as a truted user
                }
            }

            ctx.send()
        }, ctx)

        return next()
    }
}

module.exports = controller