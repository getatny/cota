const validator = {
    validate(data, rules, i18n) {
        console.log(data)
        return new Promise((resolve, reject) => {
            let errors = []
            for (let item in data) {
                const currentRules = rules[item].split(',')
                currentRules.forEach(rule => {
                    if (rule === 'required') {
                        if (!this.notEmpty(data[item])) {
                            errors.push(i18n.t('input.' + item) + ' ' + i18n.t('validator.required'))
                        }
                    } else {
                        if (this.notEmpty(data[item])) {
                            if (rule === 'email') {
                                if (!this.isEmail(data[item])) {
                                    errors.push(i18n.t('validator.email'))
                                }
                            } else if (rule === 'website') {
                                if (!this.isWebsite(data[item])) {
                                    errors.push(i18n.t('validator.website'))
                                }
                            }
                        }
                    }
                })
            }

            errors.length > 0 ? reject(errors) : resolve()
        })
    },

    notEmpty(value) {
        return value && value !== ''
    },

    isEmail(value) {
        return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
    },

    isWebsite(value) {
        return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:ww‌​w.|[-;:&=\+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?‌​(?:[\w]*))?)/.test(value)
    }
}

module.exports = validator
