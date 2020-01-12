const md5 = require('js-md5')
const { format } = require('timeago.js')
const dom = require('./plugin/dom')
const http = require('./plugin/http')
const I18n = require('./plugin/i18n')
const validator = require('./plugin/validator')
const emoticonImg = require('./imgs/emoticon.png')
const profileImg = require('./imgs/profile.png')
const successImg = require('./imgs/success.png')
const infoImg = require('./imgs/info.png')
const failedImg = require('./imgs/failed.png')

class CotaBase {
    constructor(options) {
        this.d = window.document
        this.commentPage = 1 // current comment page number

        this.commentTo = null

        this.emojiSelectBoxStatus = false
        this.userInfoBoxStatus = false

        this.notificationTimer = null

        this.userInfo = JSON.parse(window.localStorage.getItem('cota_user')) || { email: undefined, nickname: undefined, website: undefined }
        this.init(options)
    }

    init = (options) => {
        this.cota = this.d.getElementById(options.el)
        
        if (this.cota) {
            this.cota.classList.add('cota-wrapper')
            this.controller = new CotaController()
            this.gravatarMirror = options.avatarUrl
            this.commentPageSize = options.pageSize
            this.lang = options.lang
            this.i18n = new I18n(options.lang)

            this.emojiList = this.controller.getEmojiFromServer()

            this.importCSS('https://fonts.font.im/css?family=Open+Sans') // load google font
            this.generateComment()
        }
    }

    generateComment = () => {
        // comment-box el
        this.commentBox = dom.create({
            type: 'div',
            className: 'comment-box',
            innerHtml: '<textarea class="comment-input"></textarea><div id="comment-btns"></div><div class="cota-info">i<a href="https://github.com/getatny/cota" target="_blank">Powered by Cota</a></div>'
        })

        // user information button
        const userInfoButton = dom.createATag(this.showPopoverBox, 'user-info-button', `<img src=${profileImg} alt="profile" />`)

        // emoji button el
        this.emojiButton = dom.createATag(this.showPopoverBox, 'emoji', `<img src=${emoticonImg} alt="emoticon" />`)

        // submit button el
        const submitButton = dom.createATag(this.getCommentAndSubmit, 'submit', this.i18n.t('button.submit'))

        // cancel reply button el
        this.cancelReplyButton = dom.createATag(this.cancelReply, 'cancel-reply-button', this.i18n.t('button.cancelReply'))
        this.cancelReplyButton.style.display = 'none' // for default situation, this button will be hide

        // comment number
        this.commentAmount = dom.create({
            type: 'div',
            className: 'comment-amount',
            innerHtml: `<span></span>${this.i18n.t('commentAmount')}`
        })

        // comment list el
        this.commentListEl = dom.create({ type: 'ul', id: 'comment-list' })

        // emoji box
        this.emojiSelectBox = dom.create({
            type: 'div',
            id: 'emoji-select-box',
            innerHtml: '<div class="box-arrow"></div>'
        })
        const emojiSelectBoxContent = dom.create({ type: 'div', className: 'box-content' })
        this.emojiSelectBox.prepend(emojiSelectBoxContent)

        // user information box
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
        dom.append(this.cota, [this.commentBox, this.commentAmount, this.commentListEl, this.emojiSelectBox, this.userInfoBox])
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
                innerHtml: `<div class="user-avatar"><img src="${this.gravatarMirror}/${md5('')}" alt="user" /></div><div class="user-login"><form id="login-form"><input name="email" placeholder="${this.i18n.t('input.email')}" /><input name="nickname" placeholder="${this.i18n.t('input.nickname')}" /><input name="website" placeholder="${this.i18n.t('input.website')}" /></form></div>`
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
            innerHtml: `<div class="user-avatar" title="${this.i18n.t('button.logout')}"><img src="${this.gravatarMirror}/${md5(userInfo.email)}" alt="${userInfo.nickname}" /></div><div class="info-detail"><div class="email">${userInfo.email}</div><div class="nickname">${userInfo.nickname}</div></div>`
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
        this.controller.getCommentFromServer(this.d.location.pathname, this.commentPage, this.commentPageSize, this.userInfo).then(res => {
            this.commentAmount.querySelector('span').innerText = res.count
            this.renderCommentListItem(res.comments, res.count)
        })
    }

    renderCommentListItem = (commentList, count) => {
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

        this.renderLoadMoreButton(count)
    }

    renderLoadMoreButton = (count) => {
        const ifExist = this.d.querySelector('#load-more')

        if (ifExist) {
            if (count > (this.commentPage * this.commentPageSize)) {
                ifExist.style.display = 'inline-block'
            } else {
                ifExist.style.display = 'none'
            }
        } else {
            if (count > (this.commentPage * this.commentPageSize)) {
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
        }
    }

    switchCommentBoxPlace = (el) => {
        el.prepend(this.commentBox)
    }

    replyComment = (e) => {
        // hide main comment box
        this.cota.querySelector('.comment-box').remove()

        // show comment box below the comment which user wanna reply
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
        validator.validate(this.userInfo, {
            email: 'required,email',
            nickname: 'required',
            website: 'website'
        }, this.i18n).then(() => {
            const value = e.target.parentElement.previousElementSibling.value

            return validator.validate({ comment: value }, { comment: 'required' }, this.i18n).then(() => {
                this.controller.submitComment({
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
                        this.notify(this.i18n.t('commentSubmitSuccess'), 'success')

                        const commentListItem = this.createCommentItem({
                            id: res.response.id,
                            postId: res.response.postId,
                            parentId: res.response.parentId,
                            rootId: res.response.rootId,
                            email: res.response.email,
                            website: res.response.website,
                            nickname: res.response.nickname,
                            comment: res.response.comment,
                            createdAt: format(new Date().getTime())
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
                        this.notify(this.i18n.t('commentSubmitFailed'), 'failed')
                    }
                }).catch(() => this.notify(this.i18n.t('commentSubmitFailed'), 'failed'))
            })
        }).catch(errors => {
            let msg = ''
            errors.forEach((item, index) => {
                errors.length > 1 ? (msg += `${index + 1}.${item}\n`) : null
                errors.length === 1 ? (msg += `${item}`) : null
            })
            this.notify(msg, 'failed')
            if (!this.userInfo.email) this.commentBox.querySelector('.user-info-button').click()
        })
    }

    showPopoverBox = (e) => {
        let target = e.target
        let actualTarget

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

    loadMoreComments = () => {
        this.controller.getCommentFromServer(this.d.location.pathname, (this.commentPage + 1), this.commentPageSize, this.userInfo).then(res => {
            this.commentPage++
            this.renderCommentListItem(res.comments, res.count)
        })
    }

    getElementPagePosition = (element) => {
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;
        while (current !== null) {
            if (current.className === this.cota.className) {
                break
            }
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        let actualTop = element.offsetTop;
        current = element.offsetParent;
        while (current !== null) {
            if (current.className === this.cota.className) {
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
}

class CotaController {
    constructor() {
        this.serverPath = this.getServerPathByJSLink()
    }

    submitComment = (data) => {
        return http.post(`${this.serverPath}/rest/public/comment/create`, data)
    }

    getCommentFromServer = (path, page, pageSize, userInfo) => {
        return http.get(`${this.serverPath}/rest/public/comments/${md5(path)}/${page}/${pageSize}${userInfo.email ? '?email=' + userInfo.email : ''}`).then(res => res.json()).then(res => {
            if (res.success) {
                return {
                    comments: res.response.comments,
                    count: res.response.count
                }
            }
        })
    }

    getEmojiFromServer = () => {
        return ['😀', '😃', '😄']
    }

    getServerPathByJSLink = () => {
        const schema = Array.from(document.scripts).find(item => item.src.indexOf('cota.min.js') > -1).src.match(/^(\S*):\/\//)[1]
        const server = Array.from(document.scripts).find(item => item.src.indexOf('cota.min.js') > -1).src.match(/http[s]?:\/\/(\S*)\//)[1]
        return `${schema}://${server}`
    }
}

function Cota(options = {}) {
    options = {
        el: 'cota',
        avatarUrl: 'https://dn-qiniu-avatar.qbox.me/avatar',
        pageSize: 10,
        lang: 'en',
        ...options
    }
    return new CotaBase(options)
}

window.Cota = Cota
module.exports = Cota
module.exports.default = Cota
