'use strict';
const bcrypt = require('bcrypt')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const hash = await bcrypt.hash('cota-admin', 10)
        return queryInterface.bulkInsert('admins', [{
            username: 'cota-admin',
            password: hash,
            email: 'example@cota.com',
            nickname: 'Cota',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {})
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    }
}