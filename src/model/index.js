const cotaDatabase= require('../../db/models')

const model = {
    getComments() {
        return cotaDatabase.comment.findAll()
    }
}

module.exports = model