const dbController = require('../model')
const { errorResolver } = require('./resolver')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/conf')

const controller = {
    getAdmins: async (ctx, next) => {
        const { page = 1, pageSize = 20 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: users } = await dbController.getAdmins(parseInt(page), parseInt(pageSize))

            ctx.send({
                data: users,
                count
            })
        }, ctx)

        return next()
    },
    getAdmin: async (ctx, next) => {
        const userId = ctx.params.id

        await errorResolver(async () => {
            const user = await dbController.findAdminById(parseInt(userId))
            ctx.send(user)
        }, ctx)

        return next()
    },
    login: async (ctx, next) => {
        const { username, password, remember } = ctx.request.body

        await errorResolver(async () => {
            const user = await dbController.findAdminByUsername(username)

            if (user) {
                const authPass = await bcrypt.compare(password, user.password)

                if (authPass) {
                    ctx.send({
                        user,
                        token: jwt.sign({
                            id: user.id,
                            username: user.username
                        }, config.getConfig('api.jwtSecret'), { expiresIn: remember ? '7d' : '1d' })
                    })
                } else {
                    ctx.sendError('User password is wrong.')
                }
            } else {
                ctx.sendError("User doesn't exist.")
            }
        }, ctx)

        return next()
    },
    getSettings: async (ctx, next) => {
        await errorResolver(() => {
            const configuration = config.getConfigs()
            ctx.send({
                config: configuration
            })
        }, ctx)

        return next()
    },
    setSettings: async (ctx, next) => {
        const { configs } = ctx.request.body

        await errorResolver(() => {
            config.setConfigs(configs)
            ctx.send()
        }, ctx)

        next()
    }
}

module.exports = controller
