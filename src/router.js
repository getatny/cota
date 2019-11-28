const router = require('koa-better-router')().loadMethods()
const dbController = require('./model')

router.get('/comments/:id', (ctx, next) => {
    dbController.getComments().then(result => {
        ctx.body = result
    })
    return next()
})

module.exports = router