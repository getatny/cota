const cotaDatabase= require('./definition')

console.log(cotaDatabase)

const sqlite = {
    connection: cotaDatabase,
    getComments() {
        console.log(this)
        return this.connection.Comment.findAll()
    }
}

module.exports = sqlite