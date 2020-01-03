const config = {
    dev: {
        server: 'http://localhost:4444'
    },
    prod: {
        server: ''
    }
}

const env = process.env.NODE_ENV === 'development' ? config.dev : config.prod

export default env