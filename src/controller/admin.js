const sequelize = require('../../db/models').sequelize
const dbController = require('../model')
const { errorResolver } = require('./resolver')

const controller = {
    getStatisticData: async (ctx, next) => {
        await errorResolver(async () => {
            const countSql = 'select `posts`.`postsCount`, `comments`.`passCommentsCount`, `comments`.`unpassCommentsCount`, `admins`.`adminsCount`, `users`.`usersCount`' +
                ' from (select count(id) as postsCount from `posts`) as posts, (select count(case status when 1 then 1 else null end) as passCommentsCount, count(case status' +
                ' when 0 then 1 else null end) as unpassCommentsCount from `comments`) as comments, (select count(id) as adminsCount from `admins`) as admins,' +
                ' (select count(id) as usersCount from `users`) as users'
            const [{ postsCount, passCommentsCount, unpassCommentsCount, adminsCount, usersCount }] = await sequelize.query(countSql, {
                type: sequelize.QueryTypes.SELECT
            })

            const { rows: posts } = await dbController.findPosts(0, 8)
            const { rows: comments } = await dbController.getComments({ limit: 8 })
            const { rows: users } = await dbController.getUsers(0, 8)

            ctx.send({
                postsCount,
                passCommentsCount,
                unpassCommentsCount,
                adminsCount,
                usersCount,
                posts,
                comments,
                users
            })
        }, ctx)

        return next()
    }
}

module.exports = controller