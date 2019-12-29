const dbController = require('../model')
const { errorResolver } = require('./utils')

const controller = {
    getPosts: async (ctx, next) => {
        const { page = 1, pageSize = 20 } = ctx.params

        await errorResolver(async () => {
            const posts = await dbController.findPosts(parseInt(page), parseInt(pageSize))
            ctx.send(posts)
        }, ctx)

        return next()
    }
}

module.exports = controller