const Koa = require('koa')
const serve = require('koa-static')
const json = require('koa-json')
const logger = require('koa-logger')
const publicApi = require('./router/public')
const adminApi = require('./router/admin')
const config = require('./utils/conf')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const koajwt = require('koa-jwt')
const responseHandler = require('./middleware/responseHandler')
const authErrorHandler = require('./middleware/authErrorHandler')

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(serve('dist'))
app.use(serve('admin-public')) // load admin portal
app.use(cors({
    origin: function(ctx) {
        let isWhiteList = null
        config.getConfig('api.whiteList').forEach(item => ctx.request.header.origin.indexOf(item) > -1 ? isWhiteList = ctx.request.header.origin : null)
        return isWhiteList
    }
}))
app.use(json({ pretty: false, param: 'pretty' }))

app.use(responseHandler())
app.use(authErrorHandler)
app.use(koajwt({ secret: config.getConfig('api.jwtSecret') }).unless({ path: [/\/rest\/admin\/login/, /\/rest\/public/, /\/imgs/] }))
app.use(publicApi.middleware())
app.use(adminApi.middleware())

app.listen(config.getConfig('port'), () => {
    console.info(`[Info] ${Date(Date.now()).toLocaleString()}: Cota service started on port: ${config.getConfig('port')}`)
})