const comment = require('./comment')
const post = require('./post')
const admin = require('./admin')
const user = require('./user')

module.exports = {
    ...comment,
    ...post,
    ...admin,
    ...user
}