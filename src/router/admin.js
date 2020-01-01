const Router = require('koa-better-router')
const router = Router().loadMethods()
const commentController = require('../controller/commnet')
const postController = require('../controller/post')
const adminController = require('../controller/admin')
const userController = require('../controller/user')

// =============================================================================================== comments
router.del('/comments/delete', commentController.deleteComments) // delete comments
router.get('/comments/:key/:page/:pageSize', commentController.getComments) // get all the comments of current page
router.post('/comment/approve/:commentId', commentController.approveComment)

// =============================================================================================== posts
router.get('/posts/:page/:pageSize', postController.getPosts) // get all posts of sepecify page

// =============================================================================================== admins
router.post('/login', adminController.login)
router.get('/admin/:id', adminController.getAdmin)
router.get('/admins/:page/:pageSize', adminController.getAdmins)

// =============================================================================================== users
router.get('/users/:page/:pageSize', userController.getTrustUsers)
router.post('/user/:email', userController.addTrustUser)

const api = Router({ prefix: '/admin' }).extend(router)

module.exports = api