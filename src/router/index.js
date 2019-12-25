const Router = require('koa-better-router')
const router = Router().loadMethods()
const commentController = require('../controller/commnet')

router.post('/comment/create', commentController.createComment)
router.del('/comments/delete', commentController.deleteComments)
router.get('/comments/:key', commentController.getComments)

module.exports = Router({ prefix: '/rest' }).extend(router)