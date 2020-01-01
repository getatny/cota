const cotaDatabase= require('../../db/models')
const admin = cotaDatabase.admin
const Op = cotaDatabase.Sequelize.Op

const model = {
    findAdminById(userId) {
        return admin.findOne({ where: { id: userId } })
    },
    findAdminByUsername(username) {
        return admin.findOne({ where: { username } })
    },
    findAdmins(page, pageSize) {
        return admin.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: cotaDatabase.Sequelize.literal('createdAt ASC')
        })
    }
}

module.exports = model