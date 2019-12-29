const Koa = require('koa')
const serve = require('koa-static')
const json = require('koa-json')
const logger = require('koa-logger')
const routers = require('./router')
const config = require('./config')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const koajwt = require('koa-jwt')
const responseHandler = require('./middleware/responseHandler')
const authErrorHandler = require('./middleware/authErrorHandler')

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(cors({
    origin: function(ctx) {
        let isWhiteList = null
        config.whiteList.forEach(item => ctx.request.header.origin.indexOf(item) > -1 ? isWhiteList = ctx.request.header.origin : null)
        return isWhiteList
    }
}))
app.use(json({ pretty: false, param: 'pretty' }))
app.use(serve('dist'))
app.use(serve('admin-public')) // load admin portal

app.use(responseHandler)
app.use(authErrorHandler)
app.use(routers.public.middleware())
app.use(koajwt({ secret: config.jwtSecret }.unless({ path: [/\/rest\/login/] })))
addp.use(routers.admin.middleware())

app.listen(config.port, () => {
    console.info(`[Info] ${Date(Date.now()).toLocaleString()}: Cota service started on port: ${config.port}`)
})