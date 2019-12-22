const Koa = require('koa')
const serve = require('koa-static')
const json = require('koa-json')
const logger = require('koa-logger')
const router = require('./router')
const config = require('./config')

const app = new Koa()

app.use(logger())
app.use(json({ pretty: false, param: 'pretty' }))
app.use(serve('dist'))
app.use(router.middleware())

app.listen(config.port, () => {
    console.info(`[Info] ${Date(Date.now()).toLocaleString()}: Cota service started on port: ${config.port}`)
})