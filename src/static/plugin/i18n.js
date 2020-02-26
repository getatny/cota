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
                email: 'E-Mail(required)',
                nickname: 'Nickname(required)',
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
                email: '电子邮箱(必填)',
                nickname: '昵称(必填)',
                website: '网址: http://'
            },
            validator: {
                required: '不能为空',
                email: '邮箱格式不匹配',
                website: '网址格式不匹配'
            },
            notTrusted: '待审核',
            commentAmount: '条评论',
            commentSubmitFailed: '评论失败!',
            commentSubmitSuccess: '评论成功!'
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
