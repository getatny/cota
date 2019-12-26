const Router = require('koa-better-router')
const router = Router().loadMethods()
const commentController = require('../controller/commnet')
const postController = require('../controller/post')

router.post('/comment/create', commentController.createComment) // add comment
router.del('/comments/delete', commentController.deleteComments) // delete comments
router.get('/comments/:key/:page/:pageSize', commentController.getComments) // get all the comments of current page

router.get('/posts/:page/:pageSize', postController.getPosts) // get all posts of sepecify page

module.exports = Router({ prefix: '/rest' }).extend(router)