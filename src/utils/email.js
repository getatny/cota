const mailer = require('nodemailer')
const config = require('./conf')

const email = {
    async sendEmail(to, params) {
        const { website, host, port, secure, auth: { user, pass }, subject, content } = config.getConfig('email')
        const transporter = mailer.createTransport({ host, port, secure, auth: { user, pass } })
        transporter.verify((error, success) => {
            if (error) {
                console.error('notify email send failed, Please check your email configuration.')
                console.error(error)
                return false
            } else {
                transporter.sendMail({
                    from: `"评论提醒" <${user}>`,
                    to,
                    subject: this.parseContent(subject, { ...params, website }),
                    html: this.parseContent(content, { ...params, website })
                }, (err, info) => {
                    console.log(info)
                    return !err
                })
            }
        })
    },

    parseContent(content, { nickname, commentedBy, comment, website, url, originComment }) {
        return content.replace(/%([a-zA-Z]*)%/g, (str, key) => {
            switch (key) {
                case 'nickname':
                    return nickname

                case 'website':
                    return website

                case 'commentedBy':
                    return commentedBy

                case 'comment':
                    return comment

                case 'url':
                    return url

                case 'originComment':
                    return originComment
            }
        })
    }
}

module.exports = email
