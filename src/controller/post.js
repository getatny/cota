const dbController = require('../model')

const errorResolver = async (fn, ctx) => {
    try {
        await fn()
    } catch(err) {
        console.log(err)
        ctx.body = {
            success: false,
            err
        }
    }
}

const postController = {
    getPosts: async (ctx, next) => {
        const { page = 1, pageSize = 20 } = ctx.params

        await errorResolver(async () => {
            const posts = await dbController.findPosts(parseInt(page), parseInt(pageSize))

            ctx.body = {
                success: true,
                data: posts
            }
        }, ctx)

        return next()
    }
}

module.exports = postController