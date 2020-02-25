class I18n {

    constructor(lang) {
        this.lang = lang
    }

    trans = {
        en: {
            button: {
                submit: 'Submit',
                cancelReply: 'Cancel',
                reply: 'Reply',
                login: 'Login',
                logout: 'Logout',
                emailNotify: {
                    open: ' is opening now',
                    close: ' is closing now',
                    notification: 'Comment notify'
                }
            },
            input: {
                email: 'E-Mail',
                nickname: 'Nickname',
                website: 'Website: http://'
            },
            validator: {
                required: 'can not be empty',
                email: 'Email is invalid',
                website: 'Website is invalid'
            },
            notTrusted: 'Reviewing',
            commentAmount: 'Comments',
            commentSubmitFailed: 'Submit comment failed!',
            commentSubmitSuccess: 'Submit comment successfully!'
        },

        'zh_CN': {
            button: {
                submit: '提交',
                cancelReply: '取消',
                reply: '回复',
                login: '登记',
                logout: '注销',
                emailNotify: {
                    open: '已开启',
                    close: '已关闭',
                    notification: '评论邮件提醒'
                }
            },
            input: {
                email: '电子邮箱',
                nickname: '昵称',
                website: '网址: http://'
            },
            validator: {
                required: 'can not be empty',
                email: 'Email is invalid',
                website: 'Website is invalid'
            },
            notTrusted: '待审核',
            commentAmount: '条评论'
        }
    }

    t(key) {
        const keys = key.split('.')
        let string = this.trans[this.lang]

        for (let i = 0; i < keys.length; i++) {
            string = string[keys[i]]
        }

        return string ? string : key
    }

    setLang(lang) {
        this.lang = lang
    }
}

module.exports = I18n
