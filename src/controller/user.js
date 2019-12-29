const dbController = require('../model')
const { errorResolver } = require('./utils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const controller = {
    getUsers: async (ctx, next) => {
        const { page = 1, pageSize = 20 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: users } = await dbController.findUsers(parseInt(page), parseInt(pageSize))

            ctx.send({
                data: users,
                count
            })
        }, ctx)

        return next()
    },
    getUser: async (ctx, next) => {
        const userId = ctx.params.id

        await errorResolver(async () => {
            const user = await dbController.findUserById(parseInt(userId))
            ctx.send(user)
        }, ctx)

        return next()
    },
    login: async (ctx, next) => {
        const { username, password, remember } = ctx.request.body

        await errorResolver(async () => {
            const user = await dbController.findUserByUsername(username)

            if (user) {
                const authPass = await bcrypt.compare(password, user.password)

                if (authPass) {
                    ctx.send({
                        user,
                        token: jwt.sign({
                            id: user.id,
                            username: user.username
                        }, 'cotaToken', { expiresIn: remember ? '7d' : '1d' })
                    })
                } else {
                    ctx.sendError('User password is wrong.')
                }
            } else {
                ctx.sendError("User doesn't exist.")
            }
        }, ctx)

        return next()
    }
}

module.exports = controller