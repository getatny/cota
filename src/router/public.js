const Router = require('koa-better-router')
const router = Router().loadMethods()
const commentController = require('../controller/commnet')
const postController = require('../controller/post')
const userController = require('../controller/user')

router.post('/comment/create', commentController.createComment) // add comment
router.get('/comments/:key/:page/:pageSize', commentController.getComments) // get all the comments of current page

module.exports = Router({ prefix: '/rest' }).extend(router)