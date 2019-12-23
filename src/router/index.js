const router = require('koa-better-router')().loadMethods()
const dbController = require('../model')

router.get('/rest/comments/:id', (ctx, next) => {
    dbController.getComments().then(result => {
        ctx.body = result
    })
    return next()
})

router.get('/rest/test', (ctx, next) => {
    ctx.body = ctx
    return next()
})

module.exports = router