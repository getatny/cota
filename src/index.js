const Koa = require('koa')
const serve = require('koa-static')
const json = require('koa-json')
const logger = require('koa-logger')
const router = require('./router')
const config = require('./config')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')

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
app.use(router.middleware())

app.listen(config.port, () => {
    console.info(`[Info] ${Date(Date.now()).toLocaleString()}: Cota service started on port: ${config.port}`)
})