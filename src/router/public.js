const Router = require('koa-better-router')
const router = Router().loadMethods()
const commentController = require('../controller/commnet')

router.post('/comment/create', commentController.createComment) // add comment
router.get('/comments/:key/:page/:pageSize', commentController.getComments) // get all the comments of current page

const api = Router({ prefix: '/rest/public' }).extend(router)

module.exports = api