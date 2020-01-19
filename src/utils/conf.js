const fs = require('fs')
const path = require('path')

module.exports = {
    configPath: path.resolve(__dirname, '../config.json'),

    getConfig(key) {
        let config = JSON.parse(fs.readFileSync(this.configPath))
        const keys = key.split('.')

        for (let i = 0;i < keys.length;i++) {
            config = config[keys[i]]
        }

        return config
    },

    getConfigs() {
        return JSON.parse(fs.readFileSync(this.configPath))
    },

    setConfig(key, value) {
        try {
            const config = JSON.parse(fs.readFileSync(this.configPath))
            const keys = key.split('.')
            let command = 'config'

            for (let i = 0;i < keys.length;i++) {
                value += '[' + keys[i] + ']'
            }

            command += ` + ${value}`
            eval(command)

            fs.writeFileSync(this.configPath, JSON.stringify(config, null, '\t'))
            return true
        } catch(err) {
            return false
        }
    },

    setConfigs(configs) {
        try {
            const originConfigs = this.getConfigs()
            fs.writeFileSync(this.configPath, JSON.stringify({
                ...originConfigs,
                ...configs
            }, null, '  '))
            return true
        } catch {
            return false
        }
    }
}
