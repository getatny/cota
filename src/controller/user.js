const dbController = require('../model')
const { errorResolver } = require('./resolver')

const controller = {
    getTrustUsers: async (ctx, next) => {
        const { page = 1, pageSize = 20 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: users } = await dbController.getUsers(parseInt(page), parseInt(pageSize))

            ctx.send({
                data: users,
                count
            })
        }, ctx)

        return next()
    },
    addTrustUser: async (ctx, next) => {
        const { email } = ctx.params

        await errorResolver(async () => {
            const trustUser = await dbController.createUser(email)
            
            ctx.send({
                data: trustUser
            })
        }, ctx)

        return next()
    }
}

module.exports = controller