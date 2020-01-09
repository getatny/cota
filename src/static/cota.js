const md5 = require('js-md5')
const dom = require('./plugin/dom')
const emoticonImg = require('./imgs/emoticon.png')
const profileImg = require('./imgs/profile.png')
const successImg = require('./imgs/success.png')
const infoImg = require('./imgs/info.png')
const failedImg = require('./imgs/failed.png')
const { format } = require('timeago.js')

const http = { // a simple http query util
    get: (url) => {
        return fetch(url)
    },
    post: (url, data) => {
        return fetch(url, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }
}

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
                logout: 'Logout'
            },
            input: {
                email: 'E-Mail',
                nickname: 'Nickname',
                website: 'Website: http://'
            },
            notTrusted: 'Reviewing'
        },

        'zh_CN': {
            button: {
                submit: '提交',
                cancelReply: '取消',
                reply: '回复',
                login: '登记',
                logout: '注销'
            },
            input: {
                email: '电子邮箱',
                nickname: '昵称',
                website: '网址: http://'
            },
            notTrusted: '待审核'
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



class CotaBase {
    constructor(options) {
        this.d = window.document
        this.cota = this.d.getElementById('cota')
        this.gravatarMirror = 'https://dn-qiniu-avatar.qbox.me/avatar'
        this.i18n = new I18n('en')

        this.commentPage = 1 // current comment page number
        this.commentPageSize = 10 // how many comments will be shown per page
        this.commentTo = null

        this.emojiSelectBoxStatus = false
        this.userInfoBoxStatus = false

        this.notificationTimer = null
        this.userInfo = JSON.parse(window.localStorage.getItem('cota_user')) || {}
        this.init(options)
    }

    init = (options) => {
        this.cota = this.d.getElementById(options.el)|| this.cota
        
        if (!this.cota) { // if this page doesn't contain any element id called 'cota', below code will never run.
            return
        } else {
            this.cota.classList.add('cota-wrapper')
            this.gravatarMirror = options.avatarUrl || this.gravatarMirror
            this.commentPageSize = options.pageSize || this.commentPageSize
            if (options.lang) {
                this.lang = options.lang || 'en'
                this.i18n.setLang(options.lang)
            }
            this.emojiList = this.getEmojiFromServer()
            this.serverPath = this.getServerPathByJSLink()

            this.importCSS('https://fonts.font.im/css?family=Open+Sans') // 加载谷歌字体
            this.generateComment()
        }
    }

    generateComment = () => {
        // comment-box el
        this.commentBox = dom.create({
            type: 'div',
            className: 'comment-box',
            innerHtml: '<textarea class="comment-input"></textarea><div id="comment-btns"></div><div class="cota-info">i<a href="https://github.com/getatny/cota" target="_blank">powered by Cota</a></div>'
        })

        // user infomation button
        const userInfoButton = dom.createATag(this.showPopoverBox, 'user-info-button', `<img src=${profileImg} alt="profile" />`)

        // emoji button el
        this.emojiButton = dom.createATag(this.showPopoverBox, 'emoji', `<img src=${emoticonImg} alt="emoticon" />`)

        // submit button el
        const submitButton = dom.createATag(this.getCommentAndSubmit, 'submit', this.i18n.t('button.submit'))

        // cancel reply button el
        this.cancelReplyButton = dom.createATag(this.cancelReply, 'cancel-reply-button', this.i18n.t('button.cancelReply'))
        this.cancelReplyButton.style.display = 'none' // for default situation, this button will be hide

        // commnet list el
        this.commentListEl = dom.create({ type: 'ul', id: 'comment-list' })

        // emoji box
        this.emojiSelectBox = dom.create({
            type: 'div',
            id: 'emoji-select-box',
            innerHtml: '<div class="box-arrow"></div>'
        })
        const emojiSelectBoxContent = dom.create({ type: 'div', className: 'box-content' })
        this.emojiSelectBox.prepend(emojiSelectBoxContent)

        // user infomation box
        this.userInfoBox = dom.create({
            type: 'div',
            id: 'user-info-box',
            innerHtml: '<div class="box-arrow"></div>'
        })
        this.userInfoBoxContent = dom.create({ 
            type: 'div', 
            className: 'box-content'
        })
        this.userInfoBox.prepend(this.userInfoBoxContent)

        this.d.documentElement.addEventListener('click', this.hidePopoverBox) // add a global listener to close popover box

        // inject element
        dom.append(this.cota, [this.commentBox, this.commentListEl, this.emojiSelectBox, this.userInfoBox])
        dom.prepend(this.commentBox.querySelector('#comment-btns'), [submitButton, this.cancelReplyButton, this.emojiButton, userInfoButton])
        // append emoji list to emoji select popover box
        dom.append(emojiSelectBoxContent, this.emojiList, this.createEmojiEl)

        this.userInfo.email ? this.renderUserInfoDetailBox() : this.renderUserLoginBox()
        this.renderCommentList()
    }

    renderUserLoginBox = () => {
        if (this.loginBox) {
            this.userInfoBoxContent.append(this.loginBox)
        } else {
            this.loginBox = dom.create({
                type: 'div',
                className: 'user-info',
                innerHtml: `<div class="user-avatar"><img src="${this.gravatarMirror}/${md5('')}" /></div><div class="user-login"><form id="login-form"><input name="email" placeholder="${this.i18n.t('input.email')}" /><input name="nickname" placeholder="${this.i18n.t('input.nickname')}" /><input name="website" placeholder="${this.i18n.t('input.website')}" /></form></div>`
            })

            const loginButton = dom.createATag(e => {
                e.stopPropagation()
                const loginForm = this.d.forms['login-form']
                const email = loginForm.elements.email.value
                const nickname = loginForm.elements.nickname.value
                const website = loginForm.elements.website.value

                if (email !== '' && nickname !== '') {
                    this.userInfo = {
                        email,
                        nickname,
                        website
                    }
                    window.localStorage.setItem('cota_user', JSON.stringify(this.userInfo))
                    this.userInfoBoxContent.innerHTML = ''
                    this.renderUserInfoDetailBox()
                } else {
                    this.notify('Email or Nickname cannot be empty!', 'failed')
                }
            }, 'login-button', this.i18n.t('button.login'))

            dom.append(this.userInfoBoxContent, [this.loginBox, loginButton])
        }
    }

    renderUserInfoDetailBox = () => {
        const userInfo = this.userInfo
        const userInfoDetailBox = dom.create({
            type: 'div',
            className: 'user-info logout',
            innerHtml: `<div class="user-avatar" title="${this.i18n.t('button.logout')}"><img src="${this.gravatarMirror}/${md5(userInfo.email)}" /></div><div class="info-detail"><div class="email">${userInfo.email}</div><div class="nickname">${userInfo.nickname}</div></div>`
        })

        userInfoDetailBox.querySelector('.user-avatar').addEventListener('click', e => {
            e.stopPropagation()
            this.userInfo = {}
            window.localStorage.removeItem('cota_user')
            userInfoDetailBox.remove()
            this.renderUserLoginBox()
        })
        this.userInfoBoxContent.append(userInfoDetailBox)
    }

    importCSS = (path) => {
        this.d.head.append(dom.create({
            type: 'link',
            href: path,
            rel: 'stylesheet'
        }))
    }

    renderCommentList = () => {
        this.getCommentFromServer().then(res => {
            const commentList = res.comments

            // render main comments
            commentList.mainComments.forEach(item => {
                const commentListItem = this.createCommentItem(item)
                this.commentListEl.append(commentListItem)
            })

            // render child comments
            commentList.childComments.forEach(item => {
                const commentListItem = this.createCommentItem(item, true)
                this.commentListEl.querySelector(`#comment-list-item-${item.parentId} .child`).append(commentListItem)
            })

            if (res.count > this.commentPageSize) {
                // load more comments button when the number of all comments bigger than the size per page we set
                const loadMoreCommentsButton = dom.create({
                    type: 'div',
                    id: 'load-more',
                    innerHtml: 'Load More'
                }, {
                    event: 'click',
                    fn: this.loadMoreComments
                })
                this.cota.append(loadMoreCommentsButton)
            }
        })
    }

    switchCommentBoxPlace = (el) => {
        el.prepend(this.commentBox)
    }

    replyComment = (e) => {
        // hide main comment box
        this.cota.querySelector('.comment-box').remove()

        // show commnet box below the comment which user wanna reply
        this.switchCommentBoxPlace(e.target.parentElement.nextElementSibling.nextElementSibling)
        this.cancelReplyButton.style.display = 'block'
        this.commentTo = e.target.parentElement.parentElement.parentElement
    }

    cancelReply = () => {
        // hide child comment box
        this.commentListEl.querySelector('.comment-box').remove()

        // show main comment box
        this.switchCommentBoxPlace(this.cota)
        this.cancelReplyButton.style.display = 'none'
        this.commentTo = null
    }

    createCommentItem = (item) => {
        const commentListItem = dom.create({
            type: 'li',
            className: 'comment-list-item',
            id: `comment-list-item-${item.id}`,
            innerHtml: `<div class="avatar"><img src="${this.gravatarMirror}/${md5(item.email)}" alt="${item.nickname}" /></div><ul class="child"></ul>`
        })
        commentListItem.setAttribute('data-id', item.id)
        commentListItem.setAttribute('data-rootid', item.rootId ? item.rootId : item.id)

        // comment detail el
        const commentDetail = dom.create({
            type: 'div',
            className: 'comment-detail',
            innerHtml: `<div class="comment-content">${item.comment}</div><div class="comment-box-${item.id}"></div>`
        }, {
            event: 'mouseenter',
            fn: (e) => {
                e.stopPropagation()
                e.target.children[0].children[0].style.opacity = '1'
            }
        })
        commentDetail.addEventListener('mouseleave', function(e) {
            e.target.children[0].children[0].style.opacity = '0'
        })

        // comment info el
        const commentDate = format(Date.parse(item.createdAt), this.lang)
        const commentInfo = dom.create({
            type: 'div',
            className: 'comment-info',
            innerHtml: item.website ?
                `${!item.status ? '<span class="not-trust" title="' + this.i18n.t('notTrusted') + '"></span>' : ''}<a class="nickname" href="${item.website}" target="_blank">${item.nickname}</a><span class="comment-date">${commentDate}</span><div class="clear"></div>`
                : `${!item.status ? '<span class="not-trust" title="' + this.i18n.t('notTrusted') + '"></span>' : ''}<span class="nickname">${item.nickname}</span><span class="comment-date">${commentDate}</span><div class="clear"></div>`
        })

        const reply = dom.createATag(this.replyComment, 'reply-comment', this.i18n.t('button.reply'))

        commentInfo.prepend(reply)
        commentDetail.prepend(commentInfo)
        commentListItem.prepend(commentDetail)
        return commentListItem
    }

    getCommentAndSubmit = (e) => {
        if (!(this.userInfo && this.userInfo.email && this.userInfo.nickname)) {
            e.stopPropagation()
            this.notify('Please complete your personal information!', 'failed')
            this.commentBox.querySelector('.user-info-button').click()
            return
        }

        const value = e.target.parentElement.previousElementSibling.value
        
        if (value === '') { // comment value cannot be empty
            this.notify('Comment cannot be empty!', 'failed')
            return
        }

        http.post(`${this.serverPath}/rest/public/comment/create`, {
            key: md5(this.d.location.pathname),
            commentContent: value,
            email: this.userInfo.email,
            nickname: this.userInfo.nickname,
            title: this.d.title,
            url: this.d.location.href,
            parentId: this.commentTo ? parseInt(this.commentTo.dataset.id) : 0,
            rootId: this.commentTo ? parseInt(this.commentTo.dataset.rootid) : 0
        }).then(res => res.json()).then(res => {
            if (res.success) {
                this.notify('Submit comment successfully!', 'success')

                const commentListItem = this.createCommentItem({
                    id: res.response.id,
                    postId: res.response.postId,
                    parentId: res.response.parentId,
                    rootId: res.response.rootId,
                    email: res.response.email,
                    website: res.response.website,
                    nickname: res.response.nickname,
                    comment: res.response.comment,
                    createdAt: format(new Date().getTIme())
                })

                if (this.commentTo === null) {
                    this.commentListEl.prepend(commentListItem)
                } else {
                    this.commentTo.children[2].append(commentListItem)
                }

                if (e.target.previousElementSibling.style.display === 'block') {
                    e.target.previousElementSibling.click()
                }
                e.target.parentElement.previousElementSibling.value = ''
            } else {
                this.notify('Submit comment failed!', 'failed')
            }
        }).catch(() => this.notify('Submit comment failed!', 'failed'))
    }

    showPopoverBox = (e) => {
        let target = e.target
        let actualTarget = null

        if (target.className === 'emoji' || target.alt === 'emoticon') {
            actualTarget = this.emojiSelectBox
            this.emojiSelectBoxStatus = true
        } else if (target.className === 'user-info-button' || target.alt === 'profile') {
            actualTarget = this.userInfoBox
            this.userInfoBoxStatus = true
        }

        target.alt ? target = target.parentElement : null
        const boxPosition = this.getElementPagePosition(this.commentBox)
        const targetPosition = this.getElementPagePosition(target)

        if (actualTarget) {
            actualTarget.style.cssText = `top: ${targetPosition.y + this.emojiButton.offsetHeight + 12}px; left: ${boxPosition.x}px`
            actualTarget.children[1].style.left = `${(targetPosition.x + (target.offsetWidth / 2)) - boxPosition.x - 5}px`
            actualTarget.className = 'show-box'
        }
    }

    hidePopoverBox = (e) => {
        if (this.emojiSelectBoxStatus && e.target.closest('#emoji-select-box') === null && e.target.className !== 'emoji' && e.target.alt !== 'emoticon') {
            this.emojiSelectBox.className = 'hide-box'
        } 
        if (this.userInfoBoxStatus && e.target.closest('#user-info-box') === null && e.target.className !== 'user-info-button' && e.target.alt !== 'profile') {
            this.userInfoBox.className = 'hide-box'
        }
    }

    createEmojiEl = (emoji) => {
        return dom.createATag(this.insertEmojiToTextarea, null, emoji)
    }

    insertEmojiToTextarea = (e) => {
        const content = e.target.innerText
        const inputBox = this.commentBox.children[0]
        inputBox.value = inputBox.value + content
    }

    getElementPagePosition = (element) => {
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;
        while (current !== null) {
            if (current.className !== this.commentBox.className) {
                break
            }
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        let actualTop = element.offsetTop;
        current = element.offsetParent;
        while (current !== null) {
            if (current.className !== this.commentBox.className) {
                break
            }
            actualTop += (current.offsetTop+current.clientTop);
            current = current.offsetParent;
        }
        return { x: actualLeft, y: actualTop }
    }

    // custom notification component
    notify = (msg, type = 'info', delay = 3000) => {
        if (this.notificationTimer !== null) return
        let notification = null
        const existNotification = this.d.getElementById('notification')
        if (!existNotification) {
            const noti = dom.create({
                type: 'div',
                id: 'notification',
                className: 'show',
                innerHtml: `<div class="icon"><img src="${type === 'success' ? successImg : type === 'info' ? infoImg : failedImg}" alt="${type}" /></div><div class="content">${msg}</div>`
            })
            notification = noti
            this.cota.append(noti)
        } else {
            existNotification.children[0].children[0].src = type === 'success' ? successImg : type === 'info' ? infoImg : failedImg
            existNotification.children[0].children[0].alt = type
            existNotification.children[1].innerText = msg
            existNotification.className = 'show'
            notification = existNotification
        }

        this.notificationTimer = setTimeout(() => {
            notification.className = 'hide'
            this.notificationTimer = null
        }, delay)
    }

    getCommentFromServer = () => {
        return http.get(`${this.serverPath}/rest/public/comments/${md5(this.d.location.pathname)}/${this.commentPage}/${this.commentPageSize}${this.userInfo.email ? '?email=' + this.userInfo.email : ''}`).then(res => res.json()).then(res => {
            if (res.success) {
                return {
                    comments: res.response.comments,
                    count: res.response.count
                }
            }
        })
    }

    loadMoreComments = (e) => {
        
    }

    getEmojiFromServer = () => {
        return ['😀', '😃', '😄']
    }

    getServerPathByJSLink = () => {
        const schema = Array.from(document.scripts).find(item => item.src.indexOf('cota.min.js') > -1).src.match(/^(\S*):\/\//)[1]
        const server = Array.from(document.scripts).find(item => item.src.indexOf('cota.min.js') > -1).src.match(/[https|http]:\/\/(\S*)\//)[1]
        return `${schema}://${server}`
    }
}

function Cota(options = {}) {
    return new CotaBase(options)
}

window.Cota = Cota
module.exports = Cota
module.exports.default = Cota
