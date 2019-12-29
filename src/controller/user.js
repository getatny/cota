const dbController = require('../model').user
const { errorResolver } = require('./utils')
const bcrypt = require('bcrypt')

const controller = {
    getUsers: async (ctx, next) => {
        const { page = 1, pageSize = 20 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: users } = await dbController.findUsers(parseInt(page), parseInt(pageSize))

            ctx.body = {
                success: true,
                data: users,
                count
            }
        }, ctx)

        return next()
    },
    getUser: async (ctx, next) => {
        const userId = ctx.params.id

        await errorResolver(async () => {
            const user = await dbController.findUserById(parseInt(userId))

            ctx.body = {
                success: true,
                data: user
            }
        }, ctx)

        return next()
    },
    authentication: async (ctx, next) => {
        const { username, password } = ctx.request.body

        await errorResolver(async () => {
            const user = await dbController.findUserByUsername(username)

            if (user) {
                const authPass = await bcrypt.compare(password, user.password)

                if (authPass) {
                    ctx.body = {
                        success: true,
                        data: user
                    }
                } else {
                    ctx.body = {
                        success: false,
                        err: "User password is wrong."
                    }
                }
            } else {
                ctx.body = {
                    success: false,
                    err: "User doesn't exist."
                }
            }
        }, ctx)

        return next()
    }
}

module.exports = controller