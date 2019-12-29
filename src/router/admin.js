const Router = require('koa-better-router')
const router = Router().loadMethods()
const commentController = require('../controller/commnet')
const postController = require('../controller/post')
const userController = require('../controller/user')

// =============================================================================================== comments
router.del('/comments/delete', commentController.deleteComments) // delete comments
router.get('/comments/:key/:page/:pageSize', commentController.getComments) // get all the comments of current page

// =============================================================================================== posts
router.get('/posts/:page/:pageSize', postController.getPosts) // get all posts of sepecify page

// =============================================================================================== users
router.get('/user/:id', userController.getUser)
router.get('/users/:page/:pageSize', userController.getUsers)
router.post('/login', userController.authentication)

module.exports = Router({ prefix: '/admin' }).extend(router)