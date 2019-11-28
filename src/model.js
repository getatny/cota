const cotaDatabase= require('../db/models')

const model = {
    getComments() {
        console.log(this)
        return cotaDatabase.comment.findAll()
    }
}

module.exports = model