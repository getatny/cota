const cotaDatabase= require('../../db/models')
const post = cotaDatabase.user
const Op = cotaDatabase.Sequelize.Op

const model = {
    findUserById(userId) {
        return user.findOne({ where: { id: userId } })
    },
    findUserByUsername(username) {
        return user.findOne({ where: { username } })
    },
    findUsers(page, pageSize) {
        return user.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: cotaDatabase.Sequelize.literal('createdAt ASC')
        })
    }
}

module.exports = model