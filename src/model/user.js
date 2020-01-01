const cotaDatabase= require('../../db/models')
const user = cotaDatabase.user
const Op = cotaDatabase.Sequelize.Op

const model = {
    findUserById(userId) {
        return user.findOne({ where: { id: userId } })
    },
    findUserByEmail(email) {
        return user.findOne({ where: { email } })
    },
    findUsers(page, pageSize) {
        return user.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: cotaDatabase.Sequelize.literal('createdAt ASC')
        })
    },
    createUser(email) {
        return user.create({ email })
    }
}

module.exports = model