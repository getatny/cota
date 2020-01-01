module.exports = {
    port: 4444, // 默认server启动端口
    api: {
        whiteList: [ 'localhost' ], // 白名单，只有这几个域名才能访问cota api
        jwtSecret: '1233211234567' // token加密
    },
    admin: { // 后台逻辑相关设置
        trustThreshhold: 0 
    }
}