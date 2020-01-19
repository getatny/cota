const config = {
    dev: {
        server: 'http://localhost:4444',
        gravatarMirror: 'https://dn-qiniu-avatar.qbox.me/avatar'
    },
    prod: {
        server: '',
        gravatarMirror: 'https://dn-qiniu-avatar.qbox.me/avatar'
    }
}

const env = process.env.NODE_ENV === 'development' ? config.dev : config.prod

export default env