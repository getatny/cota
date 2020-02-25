const Router = require('koa-better-router')
const router = Router().loadMethods()
const commentController = require('../controller/commnet')
const postController = require('../controller/post')
const administratorController = require('../controller/administrator')
const adminController = require('../controller/admin')
const userController = require('../controller/user')

// =============================================================================================== comments
router.post('/comments/delete', commentController.deleteComments) // delete comments
router.get('/comments/:key/:page/:pageSize/:status', commentController.getComments) // get all the comments of current page
router.post('/comment/approve/:commentId', commentController.approveComment)

// =============================================================================================== posts
router.get('/posts/:page/:pageSize', postController.getPosts) // get all posts of sepecify page

// =============================================================================================== administrators
router.post('/login', administratorController.login)
router.get('/administrator/:id', administratorController.getAdmin)
router.get('/administrators/:page/:pageSize', administratorController.getAdmins)

// =============================================================================================== users
router.get('/users/:page/:pageSize', userController.getTrustUsers)
router.post('/user/:email', userController.addTrustUser)

// =============================================================================================== admin
router.get('/dashboard/statistic', adminController.getStatisticData)
router.get('/settings', administratorController.getSettings)
router.post('/settings', administratorController.setSettings)

const api = Router({ prefix: '/rest/admin' }).extend(router)

module.exports = api
