'use strict';
const faker = require('faker')
faker.locale = 'en'

module.exports = {
    up: (queryInterface, Sequelize) => {
        console.log(faker.internet.email)
        const unpassComments = Array.from({ length: 20 }, () => {
            return {
                rootId: 0,
                parentId: 0,
                email: faker.internet.email(),
                website: faker.internet.url(),
                nickname: faker.name.firstName(0),
                comment: faker.lorem.sentence(),
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })
        const passComments = Array.from({ length: 20 }, () => {
            return {
                rootId: 0,
                parentId: 0,
                email: faker.internet.email(),
                website: faker.internet.url(),
                nickname: faker.name.firstName(0),
                comment: faker.lorem.sentence(),
                status: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })
        return queryInterface.bulkInsert('comments', [...unpassComments, ...passComments], {})
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    }
};
