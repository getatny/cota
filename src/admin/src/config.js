const config = {
    dev: {
        server: 'http://localhost:4444',
        gravatarMirror: 'https://gravatar.loli.net/avatar'
    },
    prod: {
        server: '',
        gravatarMirror: 'https://gravatar.loli.net/avatar'
    }
}

const env = process.env.NODE_ENV === 'development' ? config.dev : config.prod

export default env
